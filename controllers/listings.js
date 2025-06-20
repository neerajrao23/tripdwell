const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate: {path:"author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "requested listing doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => { 
    let url = req.file.path;  
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    const location = req.body.listing.location;
    let geoData;
    try {
        // const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`, {
        //     headers: {
        //         'User-Agent': 'TripDwellApp/1.0 (neerajrao2308@gmail.com)'
        //     }
        // });
        const apiKey = process.env.LOCATIONIQ_KEY;
        // const geoResponse = await fetch(`https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(location)}&format=json`);
        const geoResponse = await fetch(`https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(location)}&format=json`);

        console.log("Geo response status:", geoResponse.status);
        if (!geoResponse.ok) {
            throw new Error("Geocoding service error");
        }
        geoData = await geoResponse.json();
    } catch (err) {
        console.error("Geocoding failed:", err);
        req.flash("error", "Could not fetch location data due to api error or reached the free tier limit of api requests for maps. Try again later.");
        return res.redirect("/listings/new");
    }
    

    if (!geoData || geoData.length === 0) {
        req.flash("error", "Location not found");
        return res.redirect("/listings/new");
    }

    newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
    };

    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "requested listing doesn't exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== 'undefined') {
        let url = req.file.path;  
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
}