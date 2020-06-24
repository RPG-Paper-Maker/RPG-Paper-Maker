/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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

StatusDatas::StatusDatas() {
    m_model = new QStandardItemModel;
}

StatusDatas::~StatusDatas()
{
    SuperListItem::deleteModel(m_model);
}

void StatusDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_STATUS), *this);
}

QStandardItemModel* StatusDatas::model() const {
    return m_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void StatusDatas::setDefault() {
    int i, length;
    SystemStatus *status;
    QStandardItem *item;

    QString names[] = {
        RPM::translate(Translations::KO)
    };
    int iconsID[] = {
        -1
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        status = new SystemStatus(i + 1, new LangsTranslation(names[i]),
            iconsID[i]);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(status)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(status->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void StatusDatas::read(const QJsonObject &json) {
    SystemStatus *status;
    QStandardItem *item;

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json[JSON_STATUS].toArray();
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        status = new SystemStatus;
        status->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(status)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(status->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void StatusDatas::write(QJsonObject &json) const {
    int i, l;
    QJsonArray tab;
    QJsonObject obj;
    SystemStatus *status;

    for (i = 0, l = m_model->invisibleRootItem()->rowCount(); i < l; i++) {
        obj = QJsonObject();
        status = reinterpret_cast<SystemStatus *>(m_model->item(i)->data()
            .value<quintptr>());
        status->write(obj);
        tab.append(obj);
    }
    json[JSON_STATUS] = tab;
}
