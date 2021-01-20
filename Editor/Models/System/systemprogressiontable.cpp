/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QtMath>
#include "systemprogressiontable.h"

const QString SystemProgressionTable::JSON_INITIAL_VALUE = "i";
const QString SystemProgressionTable::JSON_FINAL_VALUE = "f";
const QString SystemProgressionTable::JSON_EQUATION = "e";
const QString SystemProgressionTable::JSON_TABLE = "t";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemProgressionTable::SystemProgressionTable() : SystemProgressionTable(new
    PrimitiveValue(0), new PrimitiveValue(0), 0)
{

}

SystemProgressionTable::SystemProgressionTable(PrimitiveValue *initialValue,
    PrimitiveValue *finalValue, int equation) :
    m_initialValue(initialValue),
    m_finalValue(finalValue),
    m_equation(equation)
{

}

SystemProgressionTable::~SystemProgressionTable() {
    delete m_initialValue;
    delete m_finalValue;
}

PrimitiveValue * SystemProgressionTable::initialValue() const {
    return m_initialValue;
}

PrimitiveValue * SystemProgressionTable::finalValue() const {
    return m_finalValue;
}

int SystemProgressionTable::equation() const {
    return m_equation;
}

void SystemProgressionTable::setEquation(int i) {
    m_equation = i;
}

QHash<int, int> * SystemProgressionTable::table() {
    return &m_table;
}

// -------------------------------------------------------
//
//  INTERMEDIARY METHODS
//
// -------------------------------------------------------

int SystemProgressionTable::easing(int e, double x, double start, double
    change, double duration)
{
    return qFloor(easingDouble(e, x, start, change, duration));
}

// -------------------------------------------------------

double SystemProgressionTable::easingDouble(int e, double x, double start, double
    change, double duration)
{
    switch (e) {
    case 0:
        return easingLinear(x, start, change, duration);
    case -1:
        return easingQuadraticIn(x, start, change, duration);
    case 1:
        return easingQuadraticOut(x, start, change, duration);
    case -2:
        return easingCubicIn(x, start, change, duration);
    case 2:
        return easingCubicOut(x, start, change, duration);
    case -3:
        return easingQuarticIn(x, start, change, duration);
    case 3:
        return easingQuarticOut(x, start, change, duration);
    case -4:
        return easingQuinticIn(x, start, change, duration);
    case 4:
        return easingQuinticOut(x, start, change, duration);
    default:
        return 0.0;
    }
}

// -------------------------------------------------------

double SystemProgressionTable::easingLinear(double x, double start, double
    change, double duration)
{
    return change * x / duration + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingQuadraticIn(double x, double start, double
    change, double duration)
{
    x /= duration;
    return change * x * x + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingQuadraticOut(double x, double start, double
    change, double duration)
{
    x /= duration;
    return -change * x * (x - 2) + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingCubicIn(double x, double start, double
    change, double duration)
{
    x /= duration;
    return change * x * x * x + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingCubicOut(double x, double start, double
    change, double duration)
{
    x /= duration;
    x--;
    return change * (x * x * x + 1) + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingQuarticIn(double x, double start, double
    change, double duration)
{
    x /= duration;
    return change * x * x * x * x + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingQuarticOut(double x, double start, double
    change, double duration)
{
    x /= duration;
    x--;
    return -change * (x * x * x * x - 1) + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingQuinticIn(double x, double start, double
    change, double duration)
{
    x /= duration;
    return change * x * x * x * x * x + start;
}

// -------------------------------------------------------

double SystemProgressionTable::easingQuinticOut(double x, double start,
    double change, double duration)
{
    x /= duration;
    x--;
    return change * (x * x * x * x * x + 1) + start;
}

// -------------------------------------------------------

void SystemProgressionTable::reset() {
    m_initialValue->setNumberValue(0);
    m_initialValue->setKind(PrimitiveValueKind::Number);
    m_finalValue->setNumberValue(0);
    m_finalValue->setKind(PrimitiveValueKind::Number);
    m_equation = 0;
    m_table.clear();
}

// -------------------------------------------------------

bool SystemProgressionTable::isDefault() const {
    return m_initialValue->kind() == PrimitiveValueKind::Number &&
        m_initialValue->numberValue() == 0 && m_finalValue->kind() ==
        PrimitiveValueKind::Number && m_finalValue->numberValue() == 0 &&
        m_equation == 0 && m_table.isEmpty();
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

SuperListItem * SystemProgressionTable::createCopy() const {
    SystemProgressionTable *super = new SystemProgressionTable;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemProgressionTable::setCopy(const SuperListItem &super)
{
    const SystemProgressionTable *table;
    QHash<int, int>::const_iterator i;

    table = reinterpret_cast<const SystemProgressionTable *>(&super);

    m_initialValue->setCopy(*table->m_initialValue);
    m_finalValue->setCopy(*table->m_finalValue);
    m_equation = table->m_equation;
    m_table.clear();
    for (i = table->m_table.begin(); i != table->m_table.end(); i++) {
        m_table.insert(i.key(), i.value());
    }
}

// -------------------------------------------------------

void SystemProgressionTable::read(const QJsonObject &json) {
    QJsonObject obj;

    obj = json[JSON_INITIAL_VALUE].toObject();
    m_initialValue->read(obj);
    obj = json[JSON_FINAL_VALUE].toObject();
    m_finalValue->read(obj);
    m_equation = json[JSON_EQUATION].toInt();
    m_table.clear();
    QJsonArray tab = json[JSON_TABLE].toArray();
    for (int i = 0; i < tab.size(); i++) {
        QJsonObject obj = tab.at(i).toObject();
        int level = obj["k"].toInt();
        int value = obj["v"].toInt();
        m_table[level] = value;
    }
}

// -------------------------------------------------------

void SystemProgressionTable::write(QJsonObject &json) const {
    QJsonObject obj;

    obj = QJsonObject();
    m_initialValue->write(obj);
    json[JSON_INITIAL_VALUE] = obj;
    obj = QJsonObject();
    m_finalValue->write(obj);
    json[JSON_FINAL_VALUE] = obj;
    json[JSON_EQUATION] = m_equation;
    QJsonArray tab;
    QHash<int, int>::const_iterator i;
    for (i = m_table.begin(); i != m_table.end(); i++) {
        QJsonObject objHash;
        QJsonArray tabKey;
        int level = i.key();
        int value = i.value();
        objHash["k"] = level;
        objHash["v"] = value;
        tab.append(objHash);
    }
    if (!tab.isEmpty()) {
        json[JSON_TABLE] = tab;
    }
}
