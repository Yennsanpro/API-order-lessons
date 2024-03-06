const TeacherRatings = require('../models/teacherRatings.model')
const User = require('../models/user.model')
const Teacher = require('../models/teacher.model')

async function getAllRatings(req, res) {
    try {
        const ratings = await TeacherRatings.findAll()
        if (ratings) {
            return res.status(200).json(ratings)
        } else {
            return res.status(404).send('No ratings found')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function getOneRating(req, res) {
    try {
        const rating = await TeacherRatings.findByPk(req.params.id)
        if (rating) {TeacherRatings
            return res.status(200).json(rating)
        } else {
            return res.status(404).send('Rating not found')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function createRating(req, res) {
    try {
        const rating = await TeacherRatings.create( {rating: parseFloat(req.body.rating), review: req.body.review})
      
        const student = res.locals.user
        const teacher = await Teacher.findByPk(parseInt(req.body.teacher_id))
        if(!teacher || !student) return res.status(400).json('Student or teacher not found')
        student.addTeacher_rating(rating)
        teacher.addTeacher_rating(rating)

        return res.status(200).json('Rating created')
    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function updateRating(req, res) {
    try {

        const [ratingExist, rating] = await TeacherRatings.update({rating: parseFloat(req.body.rating), review: req.body.review}, {
            returning: true,
            where: {
                id: req.params.id,
            },
        })
        if (ratingExist !== 0) {
            return res.status(200).json('Rating updated')
        } else {
            return res.status(404).send('Rating not found')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

async function deleteRating(req, res) {
    try {
        const rating = await TeacherRatings.destroy({
            where: {
                id: req.params.id,
            },
        })
        if (rating) {
            return res.status(200).json('Rating deleted')
        } else {
            return res.status(404).send('Rating not found')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

async function getTeacherRatingByEmail(req, res) {
    try {
        const user = await User.findOne({
            where: {
                email: req.params.userEmail,
            },
        })
        const teacher= await user.getTeacher_info()
        console.log(teacher)
        if(!teacher || !user ) return res.status(404).send('Teacher not found')
        const ratings= await teacher.getTeacher_ratings()

        if (ratings) {
            return res.status(200).json(ratings)
        } else {
            return res.status(404).send('rating not found')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = {
    getAllRatings,
    getOneRating,
    createRating,
    updateRating,
    deleteRating,
    getTeacherRatingByEmail
}
