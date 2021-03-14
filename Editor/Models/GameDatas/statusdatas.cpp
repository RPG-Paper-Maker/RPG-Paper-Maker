/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "statusdatas.h"
#include "systemstatus.h"
#include "rpm.h"
#include "common.h"

const QString StatusDatas::JSON_STATUS = "status";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

StatusDatas::StatusDatas() :
    m_model(new QStandardItemModel)
{

}

StatusDatas::~StatusDatas()
{
    SuperListItem::deleteModel(m_model);
}

QStandardItemModel * StatusDatas::model() const
{
    return m_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void StatusDatas::read(QString path)
{
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_STATUS), *this);
}

// -------------------------------------------------------

void StatusDatas::setDefault()
{
    SuperListItem::deleteModel(m_model, false);
    m_model->appendRow((new SystemStatus(1, RPM::translate(Translations::KO), -1,
        new PrimitiveValue(PrimitiveValueKind::None), StatusRestrictionsKind
        ::CantDoAnything, new PrimitiveValue(999), new PrimitiveValue(8), false,
        false, new PrimitiveValue(0.0), false, new QStandardItemModel, new
        PrimitiveValue(QString()), new PrimitiveValue(QString()), new
        PrimitiveValue(QString()), new PrimitiveValue(QString()), new
        QStandardItemModel, new QStandardItemModel))->getModelRow());
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void StatusDatas::read(const QJsonObject &json)
{
    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json[JSON_STATUS].toArray();
    SystemStatus *status;
    for (int i = 0; i < jsonList.size(); i++)
    {
        status = new SystemStatus;
        status->read(jsonList[i].toObject());
        m_model->appendRow(status->getModelRow());
    }
}

// -------------------------------------------------------

void StatusDatas::write(QJsonObject &json) const
{
    QJsonArray tab;
    QJsonObject obj;
    SystemStatus *status;
    for (int i = 0, l = m_model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        obj = QJsonObject();
        status = reinterpret_cast<SystemStatus *>(m_model->item(i)->data()
            .value<quintptr>());
        status->write(obj);
        tab.append(obj);
    }
    json[JSON_STATUS] = tab;
}
