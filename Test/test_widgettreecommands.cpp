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
