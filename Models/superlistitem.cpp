/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "superlistitem.h"
#include "wanok.h"
#include "common.h"
#include "dialogsystemname.h"
#include "systemautotile.h"
#include "systemspritewall.h"

QString SuperListItem::pathIconRed = ":/icons/Ressources/point_r.png";
QString SuperListItem::pathIconBlue = ":/icons/Ressources/point_b.png";
QString SuperListItem::beginningText = "<>";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SuperListItem::SuperListItem() : SuperListItem(-1,"") {}

SuperListItem::~SuperListItem() {}

SuperListItem::SuperListItem(int i, QString n) : p_id(i), p_name(n) {}

int SuperListItem::id() const { return p_id; }

void SuperListItem::setId(int i) { p_id = i; }

QString SuperListItem::name() const { return p_name; }

void SuperListItem::setName(QString n){ p_name = n; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SuperListItem::setDefault(){

}

// -------------------------------------------------------

bool SuperListItem::openDialog(){
    SuperListItem super;
    super.setCopy(*this);
    DialogSystemName dialog(super);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(super);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SuperListItem::createCopy() const{
    SuperListItem* super = new SuperListItem;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SuperListItem::setCopy(const SuperListItem& item){
    p_name = item.name();
}

// -------------------------------------------------------

QString SuperListItem::toString() const {
    if (id() < 1)
        return name();
    else
        return (QString(beginningText) + idToString() + QString(": ") + name());
}

// -------------------------------------------------------

QString SuperListItem::toStringName() const {
    return (QString(beginningText) + " " + name());
}

// -------------------------------------------------------

QString SuperListItem::idToString() const {
    return Common::getFormatNumber(id());
}

// -------------------------------------------------------

void SuperListItem::deleteModel(QStandardItemModel *model, bool deleteModel){
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++)
        delete (SuperListItem*) model->item(i)->data().value<quintptr>();

    if (deleteModel)
        delete model;
    else
        model->clear();
}

// -------------------------------------------------------

void SuperListItem::deleteModelTree(QStandardItem* item){
    for (int i = 0; i < item->rowCount(); i++){
        deleteModelTree(item->child(i));
        delete (SuperListItem*) item->child(i)->data().value<quintptr>();
    }
}

// -------------------------------------------------------

int SuperListItem::getIndexById(QStandardItem* item, int id){
    int l = item->rowCount()-1;
    SuperListItem* s;

    if (l > -1) {
        for (int i = 0; i < l; i++){
            s = (SuperListItem*) item->child(i)->data().value<quintptr>();
            if (id == s->id()) return i;
        }

        s = (SuperListItem*) item->child(l)->data().value<quintptr>();
        if (s != nullptr && id == s->id())
            return l;
        else{
            s = (SuperListItem*) item->child(0)->data().value<quintptr>();
            if (s != nullptr && id == s->id())
                return 0;
        }
    }

    return -1;
}

// -------------------------------------------------------

int SuperListItem::getIdByIndex(QStandardItemModel* model, int index){
    SuperListItem* s = nullptr;

    if (index >= 0 && index < model->invisibleRootItem()->rowCount())
        s = (SuperListItem*) model->item(index)->data().value<qintptr>();

    return (s != nullptr) ? s->id() : -1;
}

// -------------------------------------------------------

SuperListItem* SuperListItem::getById(QStandardItem* item, int id, bool first){
    int l = item->rowCount()-1;

    if (l > -1){
        SuperListItem* s;

        for (int i = 0; i < l; i++){
            s = (SuperListItem*)(item->child(i)->data().value<quintptr>());
            if (id == s->id()) return s;
        }

        s = (SuperListItem*)(item->child(l)->data().value<quintptr>());
        if (s != nullptr && id == s->id())
            return s;
        else{
            s = (SuperListItem*)(item->child(0)->data().value<quintptr>());
            if (s != nullptr) {
                if (first || id == s->id())
                    return s;
            }
        }
    }

    return nullptr;
}

// -------------------------------------------------------

void SuperListItem::fillComboBox(QComboBox* comboBox,
                                 QStandardItemModel* model)
{
    int l = model->invisibleRootItem()->rowCount()-1;
    SuperListItem* sys;
    QStandardItem* item;

    if (l > -1) {
        for (int i = 0; i < l; i++){
            item = model->item(i);
            sys = ((SuperListItem*) item->data().value<quintptr>());
            comboBox->addItem(item->text());
        }

        item = model->item(l);
        sys = ((SuperListItem*) item->data().value<quintptr>());
        if (sys != nullptr)
            comboBox->addItem(item->text());
    }
}

// -------------------------------------------------------

void SuperListItem::copyModel(QStandardItemModel* model,
                                             QStandardItemModel* baseModel)
{
    SuperListItem* super, *superBase;
    QList<QStandardItem*> row;

    for (int i = 0; i < baseModel->invisibleRootItem()->rowCount(); i++) {
        superBase = (SuperListItem*) baseModel->item(i)->data()
                .value<quintptr>();
        super = superBase->createCopy();
        super->setId(superBase->id());
        row = super->getModelRow();
        model->appendRow(row);
    }
}

// -------------------------------------------------------

SuperListItem* SuperListItem::getnewInstance(PictureKind kind) {
    switch(kind) {
    case PictureKind::Autotiles:
        return new SystemAutotile;
    case PictureKind::Walls:
        return new SystemSpriteWall;
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

QList<QStandardItem *> SuperListItem::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(toString());
    row.append(item);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SuperListItem::read(const QJsonObject &json)
{
    readId(json);
    p_name = json["name"].toString();
}

// -------------------------------------------------------

void SuperListItem::readId(const QJsonObject &json){
    p_id = json["id"].toInt();
}

// -------------------------------------------------------

void SuperListItem::write(QJsonObject &json) const
{
    writeId(json);
    json["name"] = name();
}

// -------------------------------------------------------

void SuperListItem::writeId(QJsonObject &json) const{
    json["id"] = id();
}
