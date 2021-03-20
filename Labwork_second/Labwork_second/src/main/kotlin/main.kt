import parser.BeerDomParser
import parser.BeerSAXParser
import parser.BeerStAXParser

fun main() {
    val parser = BeerSAXParser("src\\main\\resources\\beerSchema.xsd")
    println(parser.parse("src//main//resources//beer.xml"))
}