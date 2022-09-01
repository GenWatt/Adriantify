class Validate {
    constructor(data, rules) {
        this.data = data
        this.rules = rules
        this.valid = true
        this.prevProp = null
        this.currentProp = null
        this.errors = []
    }

    addError = (message) => {
        if (!message) return
        this.valid = false
        if (!this.errors.find((err) => err[this.currentProp])) {
            this.errors.push({
                [this.currentProp]: [message]
            })
        } else {
            this.errors.map((err) => err[this.currentProp] && err[this.currentProp].push(message))
        }
    }

    min = (currValue, minValue) => {
        if (currValue.length < minValue) {
            this.addError(`${this.currentProp} have ${currValue.length} characters, but should have more than ${minValue}`)
        }
    }

    max = (currValue, maxValue) => {
        if (currValue.length > maxValue) {
            this.addError(`${this.currentProp} have ${currValue.length} characters, but should have less than ${maxValue}`)
        }
    }

    unique = async(currValue, model) => {
        let value = null

        try {
            value = await model.findOne({
                [this.currentProp]: currValue
            })
        } catch (error) {
            console.log(error)
        }

        if (value) {
            this.addError(`${this.currentProp} is not unique`)
        }
    }

    require = (currValue, isRequired) => {
        if (isRequired && !currValue) {
            this.addError(`${this.currentProp} is required!`)
        }
    }

    isEmail = (email) => email && email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )

    email = (email, isTrue) => {
        if (isTrue && !this.isEmail(email)) {
            this.addError(`${this.currentProp} is invalid`)
        }
    }

    isValid = async() => {
        for (const item of this.rules) {
            this.currentProp = item.name
            const value = this.data[item.name]
            for (const current in item.rule) {
                if (this[current]) {
                    await this[current](value, item.rule[current])
                }
            }
        }

        return this.valid
    }

    getErrors = () => this.errors
}

export default Validate