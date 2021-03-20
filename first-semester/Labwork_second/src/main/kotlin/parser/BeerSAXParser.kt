package parser

import model.Beer
import parser.handler.BeerHandler
import java.io.File
import java.io.IOException
import javax.xml.XMLConstants
import javax.xml.parsers.*
import javax.xml.transform.dom.DOMSource
import javax.xml.validation.SchemaFactory

import javax.xml.validation.Validator


class BeerSAXParser(validationSchemaPath: String) : BeerParser {

    private val beerHandler = BeerHandler()

    private val documentBuilder: DocumentBuilder = DocumentBuilderFactory
        .newInstance()
        .newDocumentBuilder()

    private val validator: Validator = SchemaFactory
        .newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI)
        .newSchema(File(validationSchemaPath))
        .newValidator()

    override fun parse(path: String): List<Beer> {
        val saxParserFactory = SAXParserFactory.newInstance()
        validator.validate(DOMSource(documentBuilder.parse(File(path))))
        try {
            val saxParser: SAXParser = saxParserFactory.newSAXParser()
            saxParser.parse(path, beerHandler)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return beerHandler.beers
    }
}