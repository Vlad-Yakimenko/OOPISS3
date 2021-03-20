import org.junit.Test
import parser.BeerDomParser
import parser.BeerSAXParser
import parser.BeerStAXParser
import java.io.IOException
import kotlin.test.assertEquals

internal class ParsersTest() {

    private val xsd = "src\\main\\resources\\beerSchema.xsd"

    private val staxParser: BeerStAXParser = BeerStAXParser(xsd)
    private val domParser: BeerDomParser = BeerDomParser(xsd)
    private val saxParser: BeerSAXParser = BeerSAXParser(xsd)
    private val xml = "src\\main\\resources\\beer.xml"

    @Test
    @Throws(IOException::class)
    fun shouldCreateCorrectFileWithDOMParser() {
        assertEquals(
            "[Beer(id=0, name='SCHÖFFERHOFER', type=LIGHT, al=true, manufactured='Kiev', ingredients=[MALT, HOP], chars=Chars(transparency=20, filtered=true, calories=342)), " +
                    "Beer(id=1, name='Test', type=DARK, al=false, manufactured='Test', ingredients=[MALT, WATER], chars=Chars(transparency=20, filtered=true, calories=342))]",
            domParser.parse(this.xml).toString()
        )
    }

    @Test
    @Throws(IOException::class)
    fun shouldCreateCorrectFileWithStAXParser() {
        assertEquals(
            "[Beer(id=null, name='SCHÖFFERHOFER', type=LIGHT, al=true, manufactured='Kiev', ingredients=[MALT, HOP], chars=Chars(transparency=20, filtered=true, calories=342)), " +
                    "Beer(id=null, name='Test', type=DARK, al=false, manufactured='Test', ingredients=[MALT, WATER], chars=Chars(transparency=20, filtered=true, calories=342))]",
            staxParser.parse(this.xml).toString()
        )
    }

    @Test
    @Throws(IOException::class)
    fun shouldCreateCorrectFileWithSAXParser() {
        assertEquals(
            "[Beer(id=0, name='SCHÖFFERHOFER', type=LIGHT, al=true, manufactured='Kiev', ingredients=[MALT, HOP], chars=Chars(transparency=20, filtered=true, calories=342)), " +
                    "Beer(id=1, name='Test', type=DARK, al=false, manufactured='Test', ingredients=[MALT, WATER], chars=Chars(transparency=20, filtered=true, calories=342))]",
            saxParser.parse(this.xml).toString()
        )
    }
}