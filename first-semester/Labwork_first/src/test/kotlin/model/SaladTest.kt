package model

import org.junit.Before
import org.junit.Test
import kotlin.test.assertEquals

class SaladTest {

    private lateinit var saladBuilder: Salad.Builder

    @Before
    fun setUp() {
        saladBuilder = Salad.Builder()
    }

    @Test
    fun caloriesForNoneElementsTest() {
        assertEquals(0.0, saladBuilder.build().calculateCals())
    }

    @Test
    fun caloriesForOneGrammTest() {
        assertEquals(
            0.49, saladBuilder
                .add(Kale(price = 9, weight = 1))
                .build()
                .calculateCals()
        )
    }

    @Test
    fun caloriesForFewElements() {
        assertEquals(
            79.7, saladBuilder
                .add(Spinach(price = 9, weight = 80))
                .add(Dill(price = 17, weight = 110))
                .add(Tomato(price = 12, weight = 200))
                .build()
                .calculateCals()
        )
    }

    @Test
    fun sortIngredientsByPriceTest() {
        val salad = saladBuilder
            .add(Tomato(price = 21, weight = 145))
            .add(Dill(price = 15, weight = 170))
            .add(Beech(price = 5, weight = 70))
            .build()

        assertEquals(
            "[[Beech: cal = 26, price = 5, weight = 70], " +
                    "[Dill: cal = 23, price = 15, weight = 170], " +
                    "[Tomato: cal = 18, price = 21, weight = 145]]",
            salad.sortedByComponent { o1, o2 -> o1.price - o2.price }.toString()
        )
    }

    @Test
    fun sortIngredientsByWeightTest() {
        val salad = saladBuilder
            .add(Tomato(price = 21, weight = 145))
            .add(Dill(price = 15, weight = 170))
            .add(Beech(price = 5, weight = 70))
            .build()

        assertEquals(
            "[[Beech: cal = 26, price = 5, weight = 70], " +
                    "[Tomato: cal = 18, price = 21, weight = 145], " +
                    "[Dill: cal = 23, price = 15, weight = 170]]",
            salad.sortedByComponent { o1, o2 -> o1.weight - o2.weight }.toString()
        )
    }

    @Test
    fun sortIngredientsByCaloriesTest() {
        val salad = saladBuilder
            .add(Tomato(price = 21, weight = 145))
            .add(Dill(price = 15, weight = 170))
            .add(Beech(price = 5, weight = 70))
            .build()

        assertEquals(
            "[[Tomato: cal = 18, price = 21, weight = 145], " +
                    "[Dill: cal = 23, price = 15, weight = 170], " +
                    "[Beech: cal = 26, price = 5, weight = 70]]",
            salad.sortedByComponent { o1, o2 -> o1.cal - o2.cal }.toString()
        )
    }

    @Test
    fun filterByCal() {
        val salad = saladBuilder
            .add(Tomato(price = 21, weight = 145))
            .add(Dill(price = 15, weight = 170))
            .add(Beech(price = 5, weight = 70))
            .build()

        assertEquals(
            "[[Dill: cal = 23, price = 15, weight = 170], " +
                    "[Beech: cal = 26, price = 5, weight = 70]]",
            salad.filteredByCal(20, 30).toString()
        )
    }
}