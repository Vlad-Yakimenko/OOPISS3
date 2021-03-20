package parser

import model.Beer

interface BeerParser {

    fun parse(path: String): List<Beer>
}