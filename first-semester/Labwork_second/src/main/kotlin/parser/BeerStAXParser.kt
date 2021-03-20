package parser

import model.Beer
import parser.handler.BeerHandler
import java.io.File
import javax.xml.XMLConstants
import javax.xml.stream.XMLInputFactory
import javax.xml.validation.SchemaFactory
import javax.xml.validation.Validator

import java.io.FileInputStream
import javax.xml.parsers.DocumentBuilder
import javax.xml.parsers.DocumentBuilderFactory

import javax.xml.stream.XMLEventReader
import javax.xml.transform.dom.DOMSource


class BeerStAXParser(validationSchemaPath: String) : BeerParser {

    private val beerHandler = BeerHandler()

    private val documentBuilder: DocumentBuilder = DocumentBuilderFactory
        .newInstance()
        .newDocumentBuilder()

    private val validator: Validator = SchemaFactory
        .newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI)
        .newSchema(File(validationSchemaPath))
        .newValidator()

    override fun parse(path: String): List<Beer> {
        val xmlInputFactory = XMLInputFactory.newInstance()
        validator.validate(DOMSource(documentBuilder.parse(File(path))))
        val reader: XMLEventReader
        try {
            reader = xmlInputFactory.createXMLEventReader(FileInputStream(path))
            while (reader.hasNext()) {
                var nextEvent = reader.nextEvent()
                if (nextEvent.isStartElement) {
                    val startElement = nextEvent.asStartElement()
                    var attributeString: String? = null
                    val string = startElement.name.localPart
                    if (nextEvent.isAttribute) attributeString = nextEvent.asCharacters().toString()
                    nextEvent = reader.nextEvent()
                    if (nextEvent.isCharacters) {
                        beerHandler.elementValue = nextEvent.asCharacters().data
                        beerHandler.setField(string, attributeString)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return beerHandler.beers
    }
}