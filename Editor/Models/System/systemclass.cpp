/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemclass.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"
#include "systemcharacteristic.h"
#include "rpm.h"

const QString SystemClass::jsonInitialLevel = "iniL";
const QString SystemClass::jsonMaxLevel = "mxL";
const QString SystemClass::jsonExpBase = "eB";
const QString SystemClass::jsonExpInflation = "eI";
const QString SystemClass::jsonExpTable = "eT";
const QString SystemClass::JSON_CHARACTERISTICS = "characteristics";
const QString SystemClass::jsonStats = "stats";
const QString SystemClass::jsonSkills = "skills";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemClass::SystemClass() :
    SystemClass(1, "", 1, 100, 5, 30)
{

}

SystemClass::SystemClass(int i, QString name, int initialLevel, int maxLevel,
    int expBase, int expInflation, QStandardItemModel *characteristics,
    QStandardItemModel *stats, QStandardItemModel *skills) :
    SystemTranslatable(i, name),
    m_initialLevel(initialLevel),
    m_maxLevel(maxLevel),
    m_expBase(expBase),
    m_expInflation(expInflation),
    m_characteristics(characteristics),
    m_statisticsProgression(stats),
    m_skills(skills)
{
    this->initializeHeaders();
}

SystemClass::~SystemClass()
{
    SuperListItem::deleteModel(m_characteristics);
    SuperListItem::deleteModel(m_statisticsProgression);
    SuperListItem::deleteModel(m_skills);
}

int SystemClass::initialLevel() const
{
    return m_initialLevel;
}

void SystemClass::setInitialLevel(int i, SystemClass *originalClass)
{
    m_initialLevel = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->initialLevel() != i) ? i : -1;
}

int SystemClass::maxLevel() const
{
    return m_maxLevel;
}

void SystemClass::setMaxLevel(int i, SystemClass *originalClass)
{
    m_maxLevel = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->maxLevel() != i) ? i : -1;
}

int SystemClass::expBase() const {
    return m_expBase;
}

void SystemClass::setExpBase(int i, SystemClass *originalClass)
{
    m_expBase = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->expBase() != i) ? i : -1;
}

int SystemClass::expInflation() const {
    return m_expInflation;
}

void SystemClass::setExpInflation(int i, SystemClass *originalClass)
{
    m_expInflation = originalClass == nullptr || originalClass == this ||
        (originalClass != this && originalClass->expInflation() != i) ? i : -1;
}

QHash<int, int> * SystemClass::expTable()
{
    return &m_expTable;
}

QStandardItemModel * SystemClass::characteristics() const
{
    return m_characteristics;
}

QStandardItemModel* SystemClass::statisticsProgression() const
{
    return m_statisticsProgression;
}

QStandardItemModel* SystemClass::skills() const
{
    return m_skills;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemClass * SystemClass::createInheritanceClass() {
    return new SystemClass(-1, "", -1, -1, -1, -1);
}

// -------------------------------------------------------

void SystemClass::initializeHeaders() {
    m_characteristics->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::CHARACTERISTICS)}));
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

SuperListItem* SystemClass::createCopy() const
{
    SystemClass* super = new SystemClass;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemClass::setCopy(const SuperListItem &super)
{
    const SystemClass *sys;
    QHash<int, int>::const_iterator it;
    SystemTranslatable::setCopy(super);
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

    // Characteristics
    SuperListItem::deleteModel(m_characteristics, false);
    SuperListItem::copy(m_characteristics, sys->m_characteristics);

    // Skills
    SuperListItem::deleteModel(m_skills, false);
    SuperListItem::copy(m_skills, sys->m_skills);

    // Statistics progression
    SuperListItem::deleteModel(m_statisticsProgression, false);
    SuperListItem::copy(m_statisticsProgression, sys->m_statisticsProgression);
    this->initializeHeaders();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemClass::read(const QJsonObject &json){
    SystemTranslatable::read(json);
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

    // Characteristics
    SuperListItem::readTree(m_characteristics, new SystemCharacteristic,
        json, JSON_CHARACTERISTICS);

    // Statistics
    SuperListItem::readTree(m_statisticsProgression, new SystemStatisticProgression,
        json, jsonStats);

    // Skills
    SuperListItem::readTree(m_skills, new SystemClassSkill, json, jsonSkills);
}

// -------------------------------------------------------

void SystemClass::write(QJsonObject &json) const{
    SystemTranslatable::write(json);
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

    // Characteristics
    SuperListItem::writeTree(m_characteristics, json, JSON_CHARACTERISTICS);

    // Statistics
    SuperListItem::writeTree(m_statisticsProgression, json, jsonStats);

    // Skills
    SuperListItem::writeTree(m_skills, json, jsonSkills);
}
