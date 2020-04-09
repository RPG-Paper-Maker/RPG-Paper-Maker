/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemclass.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"
#include "rpm.h"

const QString SystemClass::jsonInitialLevel = "iniL";
const QString SystemClass::jsonMaxLevel = "mxL";
const QString SystemClass::jsonExpBase = "eB";
const QString SystemClass::jsonExpInflation = "eI";
const QString SystemClass::jsonExpTable = "eT";
const QString SystemClass::jsonStats = "stats";
const QString SystemClass::jsonSkills = "skills";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemClass::SystemClass() :
    SystemClass(1, new LangsTranslation, 1, 100, 5, 30)
{

}

SystemClass::SystemClass(int i, LangsTranslation *names, int initialLevel, int
    maxLevel, int expBase, int expInflation) :
    SystemClass(i, names, initialLevel, maxLevel, expBase, expInflation, new
        QStandardItemModel, new QStandardItemModel)
{

}

SystemClass::SystemClass(int i, LangsTranslation *names, int initialLevel, int
    maxLevel, int expBase, int expInflation, QStandardItemModel *stat,
    QStandardItemModel *s) :
    SystemLang(i, names),
    m_initialLevel(initialLevel),
    m_maxLevel(maxLevel),
    m_expBase(expBase),
    m_expInflation(expInflation),
    m_statisticsProgression(stat),
    m_skills(s)
{
    this->initializeHeaders();
}

SystemClass::~SystemClass() {
    SuperListItem::deleteModel(m_statisticsProgression);
    SuperListItem::deleteModel(m_skills);
}

int SystemClass::initialLevel() const {
    return m_initialLevel;
}

void SystemClass::setInitialLevel(int i, SystemClass *originalClass) {
    m_initialLevel = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->initialLevel() != i) ? i : -1;
}

int SystemClass::maxLevel() const {
    return m_maxLevel;
}

void SystemClass::setMaxLevel(int i, SystemClass *originalClass) {
    m_maxLevel = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->maxLevel() != i) ? i : -1;
}

int SystemClass::expBase() const {
    return m_expBase;
}

void SystemClass::setExpBase(int i, SystemClass *originalClass) {
    m_expBase = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->expBase() != i) ? i : -1;
}

int SystemClass::expInflation() const {
    return m_expInflation;
}

void SystemClass::setExpInflation(int i, SystemClass *originalClass) {
    m_expInflation = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->expInflation() != i) ? i : -1;
}

QHash<int, int> * SystemClass::expTable() {
    return &m_expTable;
}

QStandardItemModel* SystemClass::statisticsProgression() const {
    return m_statisticsProgression;
}

QStandardItemModel* SystemClass::skills() const {
    return m_skills;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemClass * SystemClass::createInheritanceClass() {
    return new SystemClass(-1, new LangsTranslation, -1, -1, -1, -1);
}

// -------------------------------------------------------

void SystemClass::initializeHeaders() {
    m_statisticsProgression->setHorizontalHeaderLabels(QStringList({RPM
        ::translate(Translations::STATISTIC), RPM::translate(Translations
        ::INITIAL), RPM::translate(Translations::FINAL)}));
    m_skills->setHorizontalHeaderLabels(QStringList({RPM::translate(Translations
        ::SKILLS), RPM::translate(Translations::LEVELS)}));
}

// -------------------------------------------------------

void SystemClass::reset() {
    m_initialLevel = 1;
    m_maxLevel = 100;
    m_expBase = 0;
    m_expInflation = 0;
    m_expTable.clear();
}

// -------------------------------------------------------

void SystemClass::setClassValues() {
    m_initialLevel = -1;
    m_maxLevel = -1;
    m_expBase = -1;
    m_expInflation = -1;
    m_expTable.clear();
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemClass::createCopy() const{
    SystemClass* super = new SystemClass;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemClass::setCopy(const SuperListItem &super) {
    const SystemClass *sys;
    SystemStatisticProgression *progression;
    SystemClassSkill *classSkill;
    QList<QStandardItem *> row;
    QStandardItem *item;
    QHash<int, int>::const_iterator it;
    int i, l;

    SystemLang::setCopy(super);

    sys = reinterpret_cast<const SystemClass *>(&super);
    m_initialLevel = sys->m_initialLevel;
    m_maxLevel = sys->m_maxLevel;
    m_expBase = sys->m_expBase;
    m_expInflation = sys->m_expInflation;

    // ExpTable
    m_expTable.clear();
    for (it = sys->m_expTable.begin(); it != sys->m_expTable.end(); it++) {
        m_expTable.insert(it.key(), it.value());
    }

    // Skills
    SuperListItem::deleteModel(m_skills, false);
    for (i = 0, l = sys->skills()->invisibleRootItem()->rowCount(); i < l - 1;
         i++)
    {
        classSkill = new SystemClassSkill;
        classSkill->setCopy(*reinterpret_cast<SystemClassSkill *>(sys->skills()
            ->item(i)->data().value<quintptr>()));
        row = classSkill->getModelRow();
        m_skills->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_skills->appendRow(item);

    // Statistics progression
    SuperListItem::deleteModel(m_statisticsProgression, false);
    for (i = 0, l = sys->statisticsProgression()->invisibleRootItem()
         ->rowCount(); i < l - 1; i++)
    {
        progression = new SystemStatisticProgression;
        progression->setCopy(*reinterpret_cast<SystemStatisticProgression *>(sys
            ->statisticsProgression()->item(i)->data().value<quintptr>()));
        row = progression->getModelRow();
        m_statisticsProgression->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_statisticsProgression->appendRow(item);
    this->initializeHeaders();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemClass::read(const QJsonObject &json){
    SystemLang::read(json);
    QJsonArray tab;
    QList<QStandardItem *> row;

    // Experience
    m_initialLevel = -1;
    m_maxLevel = -1;
    m_expBase = -1;
    m_expInflation = -1;
    if (json.contains(jsonInitialLevel)) {
        m_initialLevel = json[jsonInitialLevel].toInt();
    }
    if (json.contains(jsonMaxLevel)) {
        m_maxLevel = json[jsonMaxLevel].toInt();
    }
    if (json.contains(jsonExpBase)) {
        m_expBase = json[jsonExpBase].toInt();
    }
    if (json.contains(jsonExpInflation)) {
        m_expInflation = json[jsonExpInflation].toInt();
    }

    // Exp table
    tab = json[jsonExpTable].toArray();
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        int level = obj["k"].toInt();
        int value = obj["v"].toInt();
        m_expTable[level] = value;
    }

    // Statistics
    SuperListItem::readTree(m_statisticsProgression, new
        SystemStatisticProgression, json, jsonStats);

    // Skills
    SuperListItem::readTree(m_skills, new SystemClassSkill, json, jsonSkills);
}

// -------------------------------------------------------

void SystemClass::write(QJsonObject &json) const{
    SystemLang::write(json);
    QJsonArray tab;
    QJsonObject obj;

    // Experience
    if (m_initialLevel != -1) {
        json[jsonInitialLevel] = m_initialLevel;
    }
    if (m_maxLevel != -1) {
        json[jsonMaxLevel] = m_maxLevel;
    }
    if (m_expBase != -1) {
        json[jsonExpBase] = m_expBase;
    }
    if (m_expInflation != -1) {
        json[jsonExpInflation] = m_expInflation;
    }

    // Exp table
    tab = QJsonArray();
    QHash<int, int>::const_iterator i;
    for (i = m_expTable.begin(); i != m_expTable.end(); i++){
        QJsonObject objHash;
        QJsonArray tabKey;
        int level = i.key();
        int value = i.value();
        objHash["k"] = level;
        objHash["v"] = value;
        tab.append(objHash);
    }
    if (!tab.isEmpty()) {
        json[jsonExpTable] = tab;
    }

    // Statistics
    SuperListItem::writeTree(m_statisticsProgression, json, jsonStats);

    // Skills
    SuperListItem::writeTree(m_skills, json, jsonSkills);
}
