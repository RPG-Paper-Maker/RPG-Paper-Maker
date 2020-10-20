/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_LANGS), *this);
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
    m_model->appendRow(super->getModelRow());
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
        super = new SuperListItem;
        super->read(tab[i].toObject());
        m_model->appendRow(super->getModelRow());
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
