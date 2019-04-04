/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemclass.h"
#include "main.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"

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
    QStandardItem* item;
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_statisticsProgression->appendRow(item);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_skills->appendRow(item);
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
    m_statisticsProgression->setHorizontalHeaderLabels(
                QStringList({"Statistic","Initial","Final"}));
    m_skills->setHorizontalHeaderLabels(QStringList({"Skills","Levels"}));
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
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemClass::read(const QJsonObject &json){
    SystemLang::read(json);
    QJsonArray tab;
    QList<QStandardItem *> row;
    SystemStatisticProgression* statisticProgression;
    SystemClassSkill* classSkill;

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
    tab = json[jsonStats].toArray();
    for (int i = 0; i < tab.size(); i++){
        statisticProgression = new SystemStatisticProgression;
        statisticProgression->read(tab[i].toObject());
        row = statisticProgression->getModelRow();
        m_statisticsProgression->insertRow(
                    m_statisticsProgression->invisibleRootItem()->rowCount()-1,
                    row);
    }

    // Skills
    tab = json[jsonSkills].toArray();
    for (int i = 0; i < tab.size(); i++){
        classSkill = new SystemClassSkill;
        classSkill->read(tab[i].toObject());
        row = classSkill->getModelRow();
        m_skills->insertRow(m_skills->invisibleRootItem()->rowCount()-1, row);
    }
}

// -------------------------------------------------------

void SystemClass::write(QJsonObject &json) const{
    SystemLang::write(json);
    QJsonArray tab;
    QJsonObject obj;
    int l;

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
    tab = QJsonArray();
    l = m_statisticsProgression->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        obj = QJsonObject();
        SystemStatisticProgression *statisticsProgression = reinterpret_cast<
            SystemStatisticProgression *>(m_statisticsProgression->item(i)
            ->data().value<quintptr>());
        statisticsProgression->write(obj);
        tab.append(obj);
    }
    if (!tab.isEmpty()) {
        json[jsonStats] = tab;
    }

    // Skills
    tab = QJsonArray();
    l = m_skills->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        obj = QJsonObject();
        SystemClassSkill *classSkill = reinterpret_cast<SystemClassSkill*>(
            m_skills->item(i)->data().value<quintptr>());
        classSkill->write(obj);
        tab.append(obj);
    }
    if (!tab.isEmpty()) {
        json[jsonSkills] = tab;
    }
}
