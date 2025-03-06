const Traveller = require("../models/model.traveller");

exports.signupTraveller = async (req, res) => {
    try {
        const {
            name, companyName, address1, address2, address3,
            city, country, dateOfBirth, nationality, gender,
            email, phone, mobile
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !country) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Check if email already exists
        const existingTraveller = await Traveller.findOne({ email });
        if (existingTraveller) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Create new traveller
        const traveller = new Traveller({
            name, companyName, address1, address2, address3,
            city, country, dateOfBirth, nationality, gender,
            email, phone, mobile
        });

        // Save to database
        await traveller.save();

        res.status(201).json({ message: "Signup successful", traveller });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
