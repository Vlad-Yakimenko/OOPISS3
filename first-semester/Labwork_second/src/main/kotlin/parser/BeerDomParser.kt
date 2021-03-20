package parser

import model.Beer
import model.Chars
import model.Ingredient
import model.Type
import org.w3c.dom.Document
import org.w3c.dom.Element
import org.w3c.dom.NodeList
import util.Tag
import java.io.File
import java.util.*
import javax.xml.XMLConstants
import javax.xml.parsers.DocumentBuilder
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.transform.dom.DOMSource
import javax.xml.validation.SchemaFactory
import javax.xml.validation.Validator


class BeerDomParser(validationSchemaFilepath: String) : BeerParser {

    private val documentBuilder: DocumentBuilder = DocumentBuilderFactory
        .newInstance()
        .newDocumentBuilder()

    private val validator: Validator = SchemaFactory
        .newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI)
        .newSchema(File(validationSchemaFilepath))
        .newValidator()

    override fun parse(path: String): List<Beer> {
        val document: Document = documentBuilder.parse(File(path))
        document.documentElement.normalize()

        validator.validate(DOMSource(document))

        val beers: MutableList<Beer> = ArrayList<Beer>()
        val beerNodes: NodeList = document.getElementsByTagName(Tag.BEER.tagName)
        for (i in 0 until beerNodes.length) {
            beers.add(getBeerFromElement(beerNodes.item(i) as Element))
        }

        return beers
    }

    private fun getBeerFromElement(beerElement: Element): Beer {
        val temp = beerElement.getElementsByTagName("Type")
        val id = beerElement.getAttribute(Tag.ID.tagName).toInt()
        val name = getFirstNode(beerElement, Tag.NAME).textContent
        val type = Type.valueOf(getFirstNode(beerElement, Tag.TYPE).textContent.toUpperCase())
        val al = getFirstNode(beerElement, Tag.AL).textContent.toBoolean()
        val manufactured: String = getFirstNode(beerElement, Tag.MANUFACTURE).textContent
        val ingredients = getIngredientsFromElement(getFirstNode(beerElement, Tag.INGREDIENTS) as Element)
        val chars = getCharsFromElement(getFirstNode(beerElement, Tag.CHARS) as Element)

        return Beer(id, name, type, al, manufactured, ingredients, chars)
    }

    private fun getIngredientsFromElement(ingredientsElement: Element): MutableList<Ingredient> {
        val nodes = getNodes(ingredientsElement, Tag.INGREDIENT)
        val ingredients = mutableListOf<Ingredient>()

        for (i in 0 until nodes.length) {
            ingredients.add(Ingredient.valueOf(nodes.item(i).textContent.toUpperCase()))
        }

        return ingredients
    }

    private fun getCharsFromElement(charsElement: Element): Chars {
        val transparency = getFirstNode(charsElement, Tag.TRANSPARENCY).textContent.toInt()
        val filtered = getFirstNode(charsElement, Tag.FILTERED).textContent.toBoolean()
        val calories = getFirstNode(charsElement, Tag.CALORIES).textContent.toInt()

        return Chars(transparency, filtered, calories)
    }

    private fun getFirstNode(element: Element, tag: Tag) = element.getElementsByTagName(tag.tagName).item(0)

    private fun getNodes(element: Element, tag: Tag) = element.getElementsByTagName(tag.tagName)
}