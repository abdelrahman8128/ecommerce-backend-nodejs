const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => async (req, res, next) => {
  const { id } = req.params;
  Model.findByIdAndDelete(id).then((document) => {
    if (document) {
      res.status(204).send();
    } else {
      next(new ApiError(`No document for this id ${id}`, 404));
    }
  });
};

exports.updateOne = (Model) => (req, res, next) => {
  Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).then((document) => {
    if (document) {
      document.save();
      res.status(200).json({ data: document });
    } else {
      return new ApiError(`No document for this id ${req.params.id}`, 404);
    }
  });
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    await Model.create(req.body).then((newDoc) => {
      res.status(201).json({ data: newDoc });
    });
  } catch (e) {
    next(e);
  }
};

exports.getOne = (Model,populationOpt) => (req, res, next) => {
  const { id } = req.params;
  Model.findById(id).then((document) => {
    if (document) {
      if (populationOpt) {
        document.populate(populationOpt).then((population) => {
          res.status(200).json({ data: population });

        });
      }
      else {
      res.status(200).json({ data: document });
      }
    } else {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
  });
};

exports.getAll =
  (Model, modelName = "") =>
  async(req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    mongooseQuery.then((documents) => {
      res
        .status(200)
        .json({ results: documents.length, paginationResult, data: documents });
    });
  };
