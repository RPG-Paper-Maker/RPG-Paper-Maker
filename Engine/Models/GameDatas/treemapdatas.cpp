/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "treemapdatas.h"
#include "wanok.h"
#include "treemaptag.h"
#include <QIcon>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TreeMapDatas::TreeMapDatas()
{
    m_model = new QStandardItemModel;
    addDir(m_model->invisibleRootItem(), 0, TreeMapTag::createDir("Maps"));
}

TreeMapDatas::~TreeMapDatas()
{
    SuperListItem::deleteModelTree(m_model->invisibleRootItem());
    delete m_model;
}

void TreeMapDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathTreeMap), *this);
}

QStandardItemModel* TreeMapDatas::model() const { return m_model; }

QStandardItem* TreeMapDatas::root() const { return m_model->item(0); }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TreeMapDatas::setDefault(){
    QStandardItem* item = addDir(root(), 0, TreeMapTag::createDir("Plains"));
    addMap(item, 0, TreeMapTag::createMap("MAP0001", 1));
}

// -------------------------------------------------------

QStandardItem* TreeMapDatas::add(QStandardItem *root, int i, TreeMapTag *tag,
                                 QString iconName){
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(tag)));
    item->setIcon(QIcon(":/icons/Ressources/" + iconName + ".png"));
    item->setText(tag->name());
    root->insertRow(i, item);

    return item;
}

// -------------------------------------------------------

QStandardItem* TreeMapDatas::addDir(QStandardItem* root, int i, TreeMapTag* tag)
{
    return add(root, i, tag, "dir");
}

// -------------------------------------------------------

QStandardItem* TreeMapDatas::addMap(QStandardItem *root, int i, TreeMapTag *tag)
{
    return add(root, i, tag, "map");
}

// -------------------------------------------------------

void TreeMapDatas::setName(QStandardItem *item, QString name){
    TreeMapTag* tag = (TreeMapTag*) item->data().value<quintptr>();
    tag->setName(name);
    item->setText(name);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void TreeMapDatas::read(const QJsonObject &json){
    readRoot(json["tree"].toArray(), root());
}

// -------------------------------------------------------

void TreeMapDatas::readRoot(const QJsonArray &json, QStandardItem* root){
    for (int i = 0; i < json.size(); i++) {
        QJsonObject obj = json[i].toObject();

        TreeMapTag* tag = new TreeMapTag;
        tag->read(obj);
        QStandardItem* item = (tag->isDir()) ? addDir(root, i, tag)
                                             : addMap(root, i, tag);

        if (obj.contains("children")){
            readRoot(obj["children"].toArray(), item);
        }
    }
}

// -------------------------------------------------------

void TreeMapDatas::write(QJsonObject &json) const{
    json["tree"] = getChildrenJSON(root());
}

// -------------------------------------------------------

QJsonArray TreeMapDatas::getChildrenJSON(QStandardItem* item) const{
    QJsonArray tab;
    TreeMapTag* tag;
    for (int i = 0; i < item->rowCount(); i++){
        QJsonObject json;
        tag = (TreeMapTag*) item->child(i)->data().value<quintptr>();
        tag->write(json);
        if (item->child(i)->hasChildren()){
            json["children"] = getChildrenJSON(item->child(i));
        }
        tab.append(json);
    }
    return tab;
}
