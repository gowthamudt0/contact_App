const Contact = require("../models/contactSchema");
const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");


// =========create contact -> /api/createContact/===========================
exports.CreateContact = asyncHandler(async (req, res) => {
  const { name, phone, phone1 } = req.body;
  const { _id } = req.user;
  
  try {
    if (!name || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory!" });
    }

    const existingUser = await User.findById({ _id });
    if (!existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "user not found " });
    }
    const existingContact = await Contact.findOne({ phone,userid:_id });
    if (existingContact) {
      return res.status(409).json({
        success: false,
        message: `mobile no already found named as ${existingContact.name}`,
      });
    }

    const newContact = await Contact.create({
      userid: _id,
      name,
      phone,
      phone1,
    });
    res
      .status(201)
      .json({ success: true, message: "contact added!", contact: newContact });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: "failed to add contact!" });
  }
});

// =========get contacts -> /api/getContacts/===============================
exports.getContacts = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await Contact.find({ userid: _id });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "data fetched successfully!",
        contacts: data,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "data not found!" });
    }
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ success: false, message: "failed to fetch Contact!" });
  }
});

// =========update contact -> /api/updateContact/:id========================
exports.updateContact = asyncHandler(async (req, res) => {
  
  try {
    const contact = await Contact.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (contact) {
      return res.status(200).json({
        success: true,
        message: "updated successfully!",
        contact,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "contact not found!" });
    }
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ success: false, message: "failed to fetch Contact!" });
  }
});

// =========delete contact -> /api/deleteContact/:id========================
exports.deleteContact = asyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete({ _id: req.params.id });
    if (contact) {
      return res.status(200).json({
        success: true,
        message: "deleted successfully!",
        contact,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "contact not found!" });
    }
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ success: false, message: "failed to fetch Contact!" });
  }
});
