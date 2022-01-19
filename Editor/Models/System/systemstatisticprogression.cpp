/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemstatisticprogression.h"
#include "dialogsystemstatisticprogression.h"

const QString SystemStatisticProgression::JSON_MAX = "m";
const QString SystemStatisticProgression::JSON_ISFIX = "if";
const QString SystemStatisticProgression::JSON_TABLE = "t";
const QString SystemStatisticProgression::JSON_RANDOM = "r";
const QString SystemStatisticProgression::JSON_FORMULA = "f";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatisticProgression::SystemStatisticProgression() :
    SystemStatisticProgression(1, "", new PrimitiveValue(1), true, new
    SystemProgressionTable(new PrimitiveValue(1), new PrimitiveValue(1), 0),
    new PrimitiveValue(0), new PrimitiveValue(QString()))
{

}

SystemStatisticProgression::SystemStatisticProgression(int i, QString n,
    PrimitiveValue *max, bool isFix, SystemProgressionTable *table,
    PrimitiveValue *random, PrimitiveValue *formula) :
    SuperListItem(i, n),
    m_max(max),
    m_isFix(isFix),
    m_table(table),
    m_random(random),
    m_formula(formula)
{

}

SystemStatisticProgression::~SystemStatisticProgression() {
    delete m_max;
    delete m_table;
    delete m_random;
    delete m_formula;
}

PrimitiveValue * SystemStatisticProgression::max() const {
    return m_max;
}

bool SystemStatisticProgression::isFix() const {
    return m_isFix;
}

void SystemStatisticProgression::setIsFix(bool f) {
    m_isFix = f;
}

SystemProgressionTable * SystemStatisticProgression::table() const {
    return m_table;
}

PrimitiveValue * SystemStatisticProgression::random() const {
    return m_random;
}

PrimitiveValue * SystemStatisticProgression::formula() const {
    return m_formula;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemStatisticProgression::openDialog() {
    SystemStatisticProgression statisticProgression;
    statisticProgression.setCopy(*this);
    DialogSystemStatisticProgression dialog(statisticProgression);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(statisticProgression);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemStatisticProgression::createCopy() const {
    SystemStatisticProgression* super = new SystemStatisticProgression;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemStatisticProgression::setCopy(const SuperListItem &super)
{
    const SystemStatisticProgression *progression;
    QHash<int, int>::const_iterator i;

    SuperListItem::setCopy(super);

    progression = reinterpret_cast<const SystemStatisticProgression *>(&super);
    p_id = progression->p_id;
    m_max->setCopy(*progression->m_max);
    m_isFix = progression->m_isFix;
    m_table->setCopy(*progression->m_table);
    m_random->setCopy(*progression->m_random);
    m_formula->setCopy(*progression->m_formula);
}

// -------------------------------------------------------

QList<QStandardItem *> SystemStatisticProgression::getModelRow() const {
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* itemStatistic = new QStandardItem;
    QStandardItem* itemInitial = new QStandardItem;
    QStandardItem* itemFinal = new QStandardItem;
    itemStatistic->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemStatistic->setText(toString());
    itemInitial->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemInitial->setText(m_isFix ? m_table->initialValue()->toString() : "-");
    itemFinal->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemFinal->setText(m_isFix ? m_table->finalValue()->toString() : "-");
    itemStatistic->setFlags(itemStatistic->flags() ^ (Qt::ItemIsDropEnabled));
    itemInitial->setFlags(itemInitial->flags() ^ (Qt::ItemIsDropEnabled));
    itemFinal->setFlags(itemFinal->flags() ^ (Qt::ItemIsDropEnabled));
    row.append(itemStatistic);
    row.append(itemInitial);
    row.append(itemFinal);

    return row;
}

// -------------------------------------------------------

void SystemStatisticProgression::read(const QJsonObject &json) {
    SuperListItem::read(json);
    QJsonObject obj;

    obj = json[JSON_MAX].toObject();
    m_max->read(obj);
    m_isFix = json[JSON_ISFIX].toBool();

    if (m_isFix) {
        obj = json[JSON_TABLE].toObject();
        m_table->read(obj);
        obj = json[JSON_RANDOM].toObject();
        m_random->read(obj);
    } else {
        obj = json[JSON_FORMULA].toObject();
        m_formula->read(obj);
    }
}

// -------------------------------------------------------

void SystemStatisticProgression::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonObject obj;

    obj = QJsonObject();
    m_max->write(obj);
    json[JSON_MAX] = obj;
    json[JSON_ISFIX] = m_isFix;

    if (m_isFix) {
        obj = QJsonObject();
        m_table->write(obj);
        json[JSON_TABLE] = obj;
        obj = QJsonObject();
        m_random->write(obj);
        json[JSON_RANDOM] = obj;
    } else {
        obj = QJsonObject();
        m_formula->write(obj);
        json[JSON_FORMULA] = obj;
    }
}
