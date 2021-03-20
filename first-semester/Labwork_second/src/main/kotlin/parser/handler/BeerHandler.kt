package parser.handler

import model.Beer
import model.Chars
import model.Ingredient
import model.Type
import org.xml.sax.Attributes
import org.xml.sax.helpers.DefaultHandler

class BeerHandler : DefaultHandler() {

    var beers: MutableList<Beer> = mutableListOf()
    lateinit var elementValue: String

    override fun characters(ch: CharArray, start: Int, length: Int) {
        elementValue = String(ch, start, length)
    }

    override fun startDocument() {
        beers = mutableListOf()
    }

    override fun startElement(uri: String?, lName: String?, qName: String?, attr: Attributes?) {
        when (qName) {
            BEER -> {
                val beer = Beer()
                beer.id = attr?.getValue(0)?.toInt()
                beers.add(beer)
            }
            INGREDIENTS -> currentBeer().ingredients = mutableListOf()
            CHARS -> currentBeer().chars = Chars()
        }
    }

    override fun endElement(uri: String, localName: String, qName: String) {
        setField(qName)
    }

    private fun setField(qName: String?) {
        when (qName) {
            ID -> currentBeer().id = (elementValue!!.toInt())
            NAME -> currentBeer().name = elementValue!!
            TYPE -> currentBeer().type = Type.valueOf(elementValue!!.toUpperCase())
            AL -> currentBeer().al = elementValue.toBoolean()
            MANUFACTURE -> currentBeer().manufactured = elementValue!!
            INGREDIENT -> currentBeer().ingredients.add(Ingredient.valueOf(elementValue!!.toUpperCase()))
            TRANSPARENCY -> currentBeer().chars.transparency = elementValue!!.toInt()
            FILTERED -> currentBeer().chars.filtered = elementValue.toBoolean()
            CALORIES -> currentBeer().chars.calories = elementValue!!.toInt()
        }
    }

    fun setField(qName: String?, attribute: String?) {
        when (qName) {
            BEER -> {
                val beer = Beer()
                beer.id = attribute?.toInt()
                beers.add(beer)
            }
            INGREDIENTS -> currentBeer().ingredients = mutableListOf()
            CHARS -> currentBeer().chars = Chars()
            else -> setField(qName)
        }
    }

    private fun currentBeer(): Beer {
        return beers[beers.size - 1]
    }

    companion object {
        private const val BEER = "beer"
        private const val ID = "Id"
        private const val NAME = "name"
        private const val TYPE = "type"
        private const val AL = "al"
        private const val MANUFACTURE = "manufacture"
        private const val INGREDIENTS = "ingredients"
        private const val INGREDIENT = "ingredient"
        private const val CHARS = "chars"
        private const val TRANSPARENCY = "transparency"
        private const val FILTERED = "filtered"
        private const val CALORIES = "calories"
    }
}