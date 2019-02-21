/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
        "KO"
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
