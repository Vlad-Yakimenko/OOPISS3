package controller.command

class Help : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("help")

    override fun process(command: String): String {
        return "Commands before salad created:\n" +
                "\t\'add vegetable_name price weight\'\n" +
                "\t\tAdd ingredient to salad.\n" +
                "\t\tList of available ingredients:\n" +
                "\t\t\t-cucumber\n" +
                "\t\t\t-tomato\n" +
                "\t\t\t-radish\n" +
                "\t\t\t-kale\n" +
                "\t\t\t-spinach\n" +
                "\t\t\t-dill\n" +
                "\t\t\t-white_button\n" +
                "\t\t\t-shiitake\n" +
                "\t\t\t-beech\n" +
                "\t\'mix\'\n" +
                "\t\tCreate salad.\n\n"+
                "Commands after salad created:\n" +
                "\t\'ingredients\'\n" +
                "\t\tShow all ingredients in the salad.\n" +
                "\t\'calories\'\n" +
                "\t\tShow total sum of calories.\n" +
                "\t\'sort by param\'\n" +
                "\t\tWhere 'param' is 'cal', 'price' or 'weight'.\n" +
                "\t\tSort ingredients by set param.\n" +
                "\t\'find start end\'\n" +
                "\t\tWhere 'start' and 'end' are integer values.\n" +
                "\t\tFind ingredients in set range of calories.\n\n" +
                "And command accessible ever:\n" +
                "\t\'exit\'\n" +
                "\t\tExit from the program.\n"
    }
}