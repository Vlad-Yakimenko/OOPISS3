import parser.BeerSAXParser

fun main() {
    val parser = BeerSAXParser("src\\main\\resources\\beerSchema.xsd")
    println(parser.parse("src//main//resources//beer.xml"))
}