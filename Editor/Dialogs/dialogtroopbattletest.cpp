/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include "dialogtroopbattletest.h"
#include "ui_dialogtroopbattletest.h"
#include "panelherotroopbattletest.h"
#include "rpm.h"
#include "common.h"

 const QString DialogTroopBattleTest::JSON_TROOP_ID = "troopID";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogTroopBattleTest::DialogTroopBattleTest(int troopID, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogTroopBattleTest),
    m_troopID(troopID),
    m_battleMapID(RPM::get()->engineSettings()->battleTroopTestBattleMapID()),
    m_copy(nullptr),
    m_gameProcess(new QProcess(this))
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogTroopBattleTest::~DialogTroopBattleTest()
{
    delete ui;
    for (int i = 0, l = m_heroes.size(); i < l; i++)
    {
        delete m_heroes.at(i);
    }
    m_gameProcess->close();
    delete m_gameProcess;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogTroopBattleTest::initialize()
{
    int index = SuperListItem::getIndexById(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelBattleMaps()->invisibleRootItem(),
        m_battleMapID, true);
    SuperListItem::fillComboBox(ui->comboBoxBattleMap, RPM::get()->project()
        ->gameDatas()->battleSystemDatas()->modelBattleMaps());
    ui->comboBoxBattleMap->setCurrentIndex(index);
    QJsonArray tab = RPM::get()->engineSettings()->battleTroopTestHeroes();
    SystemHeroTroopBattleTest *hero;
    for (int i = 0, l = tab.size(); i < l; i++)
    {
        hero = new SystemHeroTroopBattleTest;
        hero->read(tab.at(i).toObject());
        this->addHero(i, hero);
    }
    if (tab.isEmpty())
    {
        this->addHero();
    }
    ui->tabWidget->setCurrentIndex(0);
}

// -------------------------------------------------------

void DialogTroopBattleTest::addHero(int index, SystemHeroTroopBattleTest *hero)
{
    if (hero == nullptr)
    {
        hero = new SystemHeroTroopBattleTest;
    }
    m_heroes.insert(index, hero);
    PanelHeroTroopBattleTest *panel = new PanelHeroTroopBattleTest(hero);
    ui->tabWidget->insertTab(index, panel, hero->name());
    connect(panel, &PanelHeroTroopBattleTest::heroChanged, this, [this, hero](
        const QString &text)
    {
        ui->tabWidget->setTabText(m_heroes.indexOf(hero), text);
    });
    ui->tabWidget->setCurrentIndex(index);
}

// -------------------------------------------------------

void DialogTroopBattleTest::translate()
{
    this->setWindowTitle(RPM::translate(Translations::TEST) + RPM::DOT_DOT_DOT);
    ui->labelBattleMap->setText(RPM::translate(Translations::BATTLE_MAP) + RPM::COLON);
    ui->pushButtonCopy->setText(RPM::translate(Translations::COPY));
    ui->pushButtonPaste->setText(RPM::translate(Translations::PASTE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogTroopBattleTest::accept()
{
    RPM::get()->engineSettings()->setBattleTroopTestBattleMapID(m_battleMapID);
    QJsonArray tab;
    QJsonObject obj;
    for (int i = 0, l = m_heroes.size(); i < l; i++)
    {
        obj = QJsonObject();
        m_heroes.at(i)->write(obj);
        tab.append(obj);
    }
    RPM::get()->engineSettings()->setBattleTroopTestHeroes(tab);
    RPM::get()->engineSettings()->write();
    QDir(RPM::get()->project()->pathCurrentProjectApp()).mkdir("Test");
    obj = QJsonObject();
    obj[JSON_TROOP_ID] = m_troopID;
    obj[EngineSettings::JSON_BATTLE_TROOP_TEST_BATTLE_MAP_ID] = m_battleMapID;
    obj[EngineSettings::JSON_BATTLE_TROOP_TEST_HEROES] = tab;
    Common::writeOtherJSON(Common::pathCombine(Common::pathCombine(RPM::get()
        ->project()->pathCurrentProjectApp(), "Test"), "test.json"), obj);

    // Run app test
    QString execName = "Game";
    #ifdef Q_OS_WIN
        execName += ".exe";
    #elif __linux__
        execName += "";
    #else
        execName += ".app";
    #endif
    if (m_gameProcess->isOpen()) {
        m_gameProcess->close();
    }
    QStringList arguments;
    arguments << "--modeTest" << "battleTroop";
    #ifdef Q_OS_WIN
        m_gameProcess->start("\"" + Common::pathCombine(RPM::get()->project()
            ->pathCurrentProject(), execName) + "\"", arguments);
    #else
        m_gameProcess->start("\"" + Common::pathCombine(RPM::get()->project()
            ->pathCurrentProject(), execName) + "\" \"" + arguments.at(0) + "\" \""
            + arguments.at(1) + "\"");
    #endif
}

// -------------------------------------------------------

void DialogTroopBattleTest::reject()
{
    RPM::get()->engineSettings()->read();
    QDir(Common::pathCombine(RPM::get()->project()->pathCurrentProjectApp(), "Test"))
        .removeRecursively();
    QDialog::reject();
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_comboBoxBattleMap_currentIndexChanged(int index)
{
    m_battleMapID = SuperListItem::getIdByIndex(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelBattleMaps(), index);
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonAdd_clicked()
{
    this->addHero(ui->tabWidget->currentIndex() + 1);
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonRemove_clicked()
{
    if (ui->tabWidget->count() > 0)
    {
        int index = ui->tabWidget->currentIndex();
        delete m_heroes.at(index);
        m_heroes.removeAt(index);
        ui->tabWidget->removeTab(index);
    }
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonCopy_clicked()
{
    m_copy = reinterpret_cast<SystemHeroTroopBattleTest *>(m_heroes.at(ui
        ->tabWidget->currentIndex()));
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonPaste_clicked()
{
    if (m_copy != nullptr)
    {
        this->addHero(ui->tabWidget->currentIndex() + 1, reinterpret_cast<
            SystemHeroTroopBattleTest *>(m_copy->createCopy()));
    }
}
