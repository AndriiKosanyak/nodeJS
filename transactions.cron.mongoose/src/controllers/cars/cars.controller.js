const path = require('path');
const uuid = require('uuid').v1();
const fs = require('fs-extra');
const { carService } = require('../../services');
const { constants: { DOCUMENT_TYPE, PHOTO_TYPE }, responseCodes: { NOT_CONTENT, OK } } = require('../../configs');
const transactionInstance = require('../../dataBase/create-transaction');

const carsController = {
    createCar: async (req, res, next) => {
        const t = await transactionInstance();

        try {
            const { photos, docs } = req;
            const newCar = req.body;

            const car = carService.createCar(newCar, t);

            if (photos) {
                const carPhotosPathWithoutPublic = path.join('cars', `${car.id}`, 'photos');
                const carPhotosFinalPath = path.join(process.cwd(), 'public', carPhotosPathWithoutPublic);

                await fs.mkdir(carPhotosFinalPath, { recursive: true });

                photos.map(async (photo) => {
                    const photoExt = photo.name.split('.').pop();
                    const photoName = `${uuid}.${photoExt}`;

                    await photo.mv(path.join(carPhotosFinalPath, photoName));

                    const file_path = await path.join(carPhotosFinalPath, photoName);
                    const file_type = PHOTO_TYPE;

                    await carService.updateCar(car.id, { file_type, file_path }, t);
                });
            }

            if (docs) {
                const carDocsPathWithoutPublic = path.join('cars', `${car.id}`, 'docs');
                const carDocsFinalPath = path.join(process.cwd(), 'public', carDocsPathWithoutPublic);

                await fs.mkdir(carDocsFinalPath, { recursive: true });

                docs.map(async (doc) => {
                    const docExt = doc.name.split('.').pop();
                    const docName = `${uuid}.${docExt}`;

                    await doc.mv(path.join(carDocsFinalPath, docName));

                    const file_path = await path.join(carDocsFinalPath, docName);
                    const file_type = DOCUMENT_TYPE;

                    await carService.updateCar(car.id, { file_type, file_path }, t);
                });
            }
            await t.commit();
            res.json(car);
        } catch (e) {
            await t.rollback();
            next(e);
        }
    },

    getCars: async (req, res, next) => {
        try {
            const cars = await carService.getAllCars();

            res.json(cars);
        } catch (e) {
            next(e);
        }
    },

    getCar: async (req, res, next) => {
        try {
            const { id } = req.params;

            const car = await carService.getCarById(id);

            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    updateCar: async (req, res, next) => {
        const t = await transactionInstance();

        try {
            const {
                photos, docs, params: { id }, body: { newData }
            } = req;

            await carService.updateCar(id, newData);

            if (photos) {
                const carPhotosPathWithoutPublic = path.join('cars', `${id}`, 'photos');
                const carPhotosFinalPath = path.join(process.cwd(), 'public', carPhotosPathWithoutPublic);

                await fs.mkdir(carPhotosFinalPath, { recursive: true });

                photos.map(async (photo) => {
                    const photoExt = photo.name.split('.').pop();
                    const photoName = `${uuid}.${photoExt}`;

                    await photo.mv(path.join(carPhotosFinalPath, photoName));

                    const file_path = await path.join(carPhotosFinalPath, photoName);
                    const file_type = PHOTO_TYPE;

                    await carService.updateCar(id, { file_type, file_path }, t);
                });
            }

            if (docs) {
                const carDocsPathWithoutPublic = path.join('cars', `${id}`, 'docs');
                const carDocsFinalPath = path.join(process.cwd(), 'public', carDocsPathWithoutPublic);

                await fs.mkdir(carDocsFinalPath, { recursive: true });

                docs.map(async (doc) => {
                    const docExt = doc.name.split('.').pop();
                    const docName = `${uuid}.${docExt}`;

                    await doc.mv(path.join(carDocsFinalPath, docName));

                    const file_path = await path.join(carDocsFinalPath, docName);
                    const file_type = DOCUMENT_TYPE;

                    await carService.updateCar(id, { file_type, file_path }, t);
                });
            }
            await t.commit();

            res.status(OK);
        } catch (e) {
            await t.rollback();

            next(e);
        }
    },

    deleteCar: async (req, res, next) => {
        const t = await transactionInstance();

        try {
            const { id } = req.params;

            const carForDeletePath = path.join(process.cwd(), 'public', 'cars', `${id}`);

            await fs.rmdir(carForDeletePath, { recursive: true });

            await carService.deleteCar(id);
            await t.commit();

            res.status(NOT_CONTENT);
        } catch (e) {
            await t.rollback();

            next(e);
        }
    }
};

module.exports = carsController;
