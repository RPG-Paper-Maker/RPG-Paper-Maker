/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemselectstatistic.h"
#include "dialogsystemselectstatistic.h"
#include "rpm.h"

const QString SystemSelectStatistic::JSON_STATISTIC_ID = "statisticID";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSelectStatistic::SystemSelectStatistic():
    SystemSelectStatistic(1, "")
{

}

SystemSelectStatistic::SystemSelectStatistic(int id, QString name,
    PrimitiveValue *statisticID):
    SuperListItem(id, name),
    m_statisticID(statisticID)
{
    m_statisticID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics());
    this->setName(m_statisticID->toString());
}

SystemSelectStatistic::~SystemSelectStatistic()
{
    delete m_statisticID;
}

PrimitiveValue * SystemSelectStatistic::statisticID() const
{
    return m_statisticID;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemSelectStatistic::openDialog()
{
    SystemSelectStatistic selectStatistic;
    selectStatistic.setCopy(*this);
    DialogSystemSelectStatistic dialog(selectStatistic);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(selectStatistic);
        this->setName(m_statisticID->toString());
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemSelectStatistic::createCopy() const
{
    SystemSelectStatistic* super = new SystemSelectStatistic;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSelectStatistic::setCopy(const SuperListItem &super)
{
    const SystemSelectStatistic *selectStatistic;
    SuperListItem::setCopy(super);
    selectStatistic = reinterpret_cast<const SystemSelectStatistic *>(&super);
    m_statisticID->setCopy(*selectStatistic->m_statisticID);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemSelectStatistic::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    if (json.contains(JSON_STATISTIC_ID))
    {
        m_statisticID->read(json[JSON_STATISTIC_ID].toObject());
    }
    this->setName(m_statisticID->toString());
}

// -------------------------------------------------------

void SystemSelectStatistic::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    if (!m_statisticID->isDefaultDataBaseValue())
    {
        QJsonObject obj;
        m_statisticID->write(obj);
        json[JSON_STATISTIC_ID] = obj;
    }
}
