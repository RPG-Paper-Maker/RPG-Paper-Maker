/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "langsdatas.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LangsDatas::LangsDatas()
{
    m_model = new QStandardItemModel;
}

LangsDatas::~LangsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void LangsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathLangs), *this);
}

QStandardItemModel* LangsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void LangsDatas::setDefault(){
    QStandardItem* item;
    SuperListItem* super;

    item = new QStandardItem();
    super = new SuperListItem(1, "English");
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->toString());
    m_model->appendRow(item);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_model->appendRow(item);
}

int LangsDatas::mainLang() const{
    return ((SuperListItem*) m_model->item(0)->data().value<quintptr>())->id();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LangsDatas::read(const QJsonObject &json){
    QStandardItem* item;
    SuperListItem* super;
    QJsonArray tab = json["langs"].toArray();

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    for (int i = 0; i < tab.size(); i++){
        item = new QStandardItem;
        super = new SuperListItem;
        super->read(tab[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setText(super->toString());
        m_model->appendRow(item);
    }

    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_model->appendRow(item);
}

// -------------------------------------------------------

void LangsDatas::write(QJsonObject &json) const{
    QJsonArray tab;
    SuperListItem* super;

    for (int i = 0; i < m_model->invisibleRootItem()->rowCount()-1; i++){
        QJsonObject obj;
        super = (SuperListItem*) m_model->item(i)->data().value<quintptr>();
        super->write(obj);
        tab.append(obj);
    }

    json["langs"] = tab;
}
