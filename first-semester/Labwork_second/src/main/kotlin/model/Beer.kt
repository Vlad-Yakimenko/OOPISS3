package model

class Beer() {

    var id: Int? = null
    lateinit var name: String
    lateinit var type: Type
    var al: Boolean? = null
    lateinit var manufactured: String
    lateinit var ingredients: MutableList<Ingredient>
    lateinit var chars: Chars

    constructor(
        id: Int,
        name: String,
        type: Type,
        al: Boolean?,
        manufactured: String,
        ingredients: MutableList<Ingredient>,
        chars: Chars
    ) : this() {
        this.id = id
        this.name = name
        this.type = type
        this.al = al
        this.manufactured = manufactured
        this.ingredients = ingredients
        this.chars = chars
    }

    override fun toString(): String {
        return "Beer(id=$id, name='$name', type=$type, al=$al, manufactured='$manufactured', ingredients=$ingredients, chars=$chars)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Beer

        if (id != other.id) return false
        if (name != other.name) return false
        if (type != other.type) return false
        if (al != other.al) return false
        if (manufactured != other.manufactured) return false
        if (ingredients != other.ingredients) return false
        if (chars != other.chars) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + name.hashCode()
        result = 31 * result + type.hashCode()
        result = 31 * result + (al?.hashCode() ?: 0)
        result = 31 * result + manufactured.hashCode()
        result = 31 * result + ingredients.hashCode()
        result = 31 * result + chars.hashCode()
        return result
    }
}