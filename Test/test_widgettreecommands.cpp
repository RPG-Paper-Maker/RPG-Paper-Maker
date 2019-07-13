/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
#include <QtTest>

#include "widgettreecommands.h"

class TestWidgetTreeCommands : public QObject
{
    Q_OBJECT

public:
    TestWidgetTreeCommands();
    ~TestWidgetTreeCommands();

private slots:
    void initTestCase();
    void cleanupTestCase();
    void test_initializeModel_noSelection();

};

TestWidgetTreeCommands::TestWidgetTreeCommands()
{
}

TestWidgetTreeCommands::~TestWidgetTreeCommands()
{

}

void TestWidgetTreeCommands::initTestCase()
{

}

void TestWidgetTreeCommands::cleanupTestCase()
{

}

void TestWidgetTreeCommands::test_initializeModel_noSelection()
{
    WidgetTreeCommands dummyWidgetTree;
    QStandardItemModel dummyModel;

    dummyWidgetTree.initializeModel(&dummyModel);

    QCOMPARE(dummyWidgetTree.getSelected(), nullptr);
}

// Widgets require a Qt application, so use QTEST_MAIN
QTEST_MAIN(TestWidgetTreeCommands)

// Other possibilities:
// QTEST_GUILESS_MAIN(TestName) for event loop only (no GUI)
// QTEST_APPLESS_MAIN(TestName) for other tests (no GUI nor events)

#include "test_widgettreecommands.moc"
