package model

class Chars() {

    var transparency: Int? = null
    var filtered: Boolean? = null
    var calories: Int? = null

    constructor(transparency: Int?, filtered: Boolean?, calories: Int?) : this() {
        this.transparency = transparency
        this.filtered = filtered
        this.calories = calories
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Chars

        if (transparency != other.transparency) return false
        if (filtered != other.filtered) return false
        if (calories != other.calories) return false

        return true
    }

    override fun hashCode(): Int {
        var result = transparency ?: 0
        result = 31 * result + (filtered?.hashCode() ?: 0)
        result = 31 * result + (calories ?: 0)
        return result
    }

    override fun toString(): String {
        return "Chars(transparency=$transparency, filtered=$filtered, calories=$calories)"
    }
}