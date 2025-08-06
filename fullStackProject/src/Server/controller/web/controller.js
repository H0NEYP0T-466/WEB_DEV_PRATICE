let express = require('express');
let model = require('../../model/enquiryModel');

let enquiryInsert = async (req, res) => {
  let { name, email, phoneNumber, message } = req.body;
  let enquiry = new model({ name, email, phoneNumber, message });

  await enquiry.save();
  res.send("Enquiry Inserted Successfully");
};

let enquiryUpdate = async (req, res) => {
  const { entry } = req.body;
  const { _id, name, email, phone, message } = entry;

  try {
    const result = await model.updateOne(
      { _id: _id },
      {
        $set: {
          name,
          email,
          phoneNumber: phone, // match field in schema
          message,
        },
      }
    );

    if (result.modifiedCount === 1) {
      res.send({ success: true, message: "Enquiry updated successfully" });
    } else {
      res.status(404).send({ success: false, message: "No record updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Update failed" });
  }
};

let enquiryDelete = async (req, res) => {
  try {
    let { name } = req.body;
    let enquiry = await model.deleteOne({ name: name });

    if (enquiry.deletedCount === 0) {
      return res.status(404).send("No enquiry found with that name");
    }

    res.send("Enquiry Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting enquiry");
  }
};

let getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await model.find();
    res.json(enquiries);
  } catch (err) {
    res.status(500).send("Error fetching enquiries");
  }
};

module.exports = {
  enquiryInsert,
  enquiryDelete,
  getAllEnquiries,
  enquiryUpdate,
};
