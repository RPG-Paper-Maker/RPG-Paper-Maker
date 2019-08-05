/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "heroesdatas.h"
#include "systemhero.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

HeroesDatas::HeroesDatas()
{
    m_model = new QStandardItemModel;
}

HeroesDatas::~HeroesDatas()
{
    SuperListItem::deleteModel(m_model);
}

void HeroesDatas::read(QString path){
    Common::readJSON(Common::pathCombine(path, RPM::PATH_HEROES), *this);
}

QStandardItemModel* HeroesDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void HeroesDatas::setDefault() {
    SystemHero* heroes[] = {
        new SystemHero(1, new LangsTranslation("Lucas"), 1, 1, 1, SystemClass
            ::createInheritanceClass()),
        new SystemHero(2, new LangsTranslation("Kate"), 2, 2, 2, SystemClass
            ::createInheritanceClass()),
        new SystemHero(3, new LangsTranslation("Bibi"), 3, 3, 3, SystemClass
            ::createInheritanceClass()),
        new SystemHero(4, new LangsTranslation("Shana"), 4, 4, 4, SystemClass
            ::createInheritanceClass())
    };
    int length = (sizeof(heroes)/sizeof(*heroes));
    QStandardItem* item;

    for (int i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(heroes[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(heroes[i]->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void HeroesDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["heroes"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemHero* sysHero = new SystemHero;
        sysHero->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysHero)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysHero->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void HeroesDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemHero* sysHero = reinterpret_cast<SystemHero*>(m_model->item(i)
            ->data().value<quintptr>());
        sysHero->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["heroes"] = jsonArray;
}
