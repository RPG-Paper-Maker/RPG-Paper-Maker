/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "superlistitem.h"
#include "rpm.h"
#include "common.h"
#include "dialogsystemname.h"
#include "systemautotile.h"
#include "systemspritewall.h"
#include "systemobject3d.h"
#include "systemmountain.h"

const QString SuperListItem::JSON_ID = "id";
const QString SuperListItem::JSON_NAME = "name";
QString SuperListItem::pathIconRed = ":/icons/Ressources/point_r.png";
QString SuperListItem::pathIconBlue = ":/icons/Ressources/point_b.png";
QString SuperListItem::beginningText = "<>";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SuperListItem::SuperListItem() : SuperListItem(-1) {}

SuperListItem::~SuperListItem() {}

SuperListItem::SuperListItem(int i, QString n, bool datas) :
    p_id(i),
    p_name(n),
    m_containsDatas(datas),
    m_displayID(true)
{

}

int SuperListItem::id() const { return p_id; }

void SuperListItem::setId(int i) { p_id = i; }

QString SuperListItem::name() const { return p_name; }

void SuperListItem::setName(QString n){ p_name = n; }

void SuperListItem::setDisplayID(bool b) {
    m_displayID = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SuperListItem::isDefault() {
    return p_id == -1;
}

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
    m_displayID = item.m_displayID;
}

// -------------------------------------------------------

QString SuperListItem::toString() const {
    return id() > 0 ? (QString(beginningText) + idToString() + QString(": ") +
        name()) : name();
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

int SuperListItem::getIndexById(QStandardItem* item, int id, bool first) {
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

    return first ? 0 : -1;
}

// -------------------------------------------------------

int SuperListItem::getIdByIndex(QStandardItemModel* model, int index){
    SuperListItem* s = nullptr;

    if (index >= 0 && index < model->invisibleRootItem()->rowCount()) {
        s = (SuperListItem*) model->item(index)->data().value<qintptr>();
    }

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

SuperListItem * SuperListItem::getByIndex(QStandardItemModel* model, int index) {
    SuperListItem* s = nullptr;

    if (index >= 0 && index < model->invisibleRootItem()->rowCount())
        s = (SuperListItem*) model->item(index)->data().value<qintptr>();

    return (s != nullptr) ? s : nullptr;
}

// -------------------------------------------------------

void SuperListItem::fillComboBox(QComboBox* comboBox, QStandardItemModel* model,
    bool showID, bool nameOnly, bool showIcon)
{
    int l = model->invisibleRootItem()->rowCount()-1;
    SuperListItem* sys;
    QStandardItem* item;
    QIcon icon;

    if (l > -1) {
        for (int i = 0; i <= l; i++) {
            item = model->item(i);
            sys = reinterpret_cast<SuperListItem *>(item->data().value<quintptr>
                ());
            if (sys != nullptr) {
                sys->getIcon(icon);
                if (showID) {
                    if (showIcon) {
                        comboBox->addItem(icon, item->text());
                    } else {
                        comboBox->addItem(item->text());
                    }
                } else if (nameOnly) {
                    if (showIcon) {
                        comboBox->addItem(icon, sys->name());
                    } else {
                        comboBox->addItem(sys->name());
                    }
                } else {
                    if (showIcon) {
                        comboBox->addItem(icon, sys->toStringName());
                    } else {
                        comboBox->addItem(sys->toStringName());
                    }
                }
            }
        }
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
    case PictureKind::Object3D:
        return new SystemObject3D;
    case PictureKind::Mountains:
        return new SystemMountain;
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

QStandardItem * SuperListItem::getEmptyItem() {
    QStandardItem *item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));

    return item;
}

// -------------------------------------------------------

QList<QStandardItem *> SuperListItem::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    if (!m_containsDatas || RPM::get()->project()->gameDatas()->isDatasRead()) {
        item->setText(m_displayID ? this->toString() : this->toStringName());
    }
    row.append(item);
    RPM::get()->project();

    return row;
}

// -------------------------------------------------------

void SuperListItem::updateModelRow(QStandardItemModel* model, int row) {
    model->item(row, 0)->setText(toString());
}

// -------------------------------------------------------

void SuperListItem::copy(QStandardItemModel *model,
                           QStandardItemModel *modelToCopy)
{
    QList<QStandardItem*> row;
    for (int i = 0; i < modelToCopy->invisibleRootItem()->rowCount()-1; i++){
        SuperListItem* super = reinterpret_cast<SuperListItem *>(modelToCopy
            ->item(i)->data().value<quintptr>());
        SuperListItem* newSuper = super->createCopy();
        row = newSuper->getModelRow();
        model->appendRow(row);
    }
    model->appendRow(SuperListItem::getEmptyItem());
}

// -------------------------------------------------------

void SuperListItem::readTree(QStandardItemModel *model, SuperListItem
    *newInstance, const QJsonObject &json, const QString &name)
{
    QList<QStandardItem*> row;
    SuperListItem *super;
    QJsonArray tab;

    tab = json[name].toArray();
    for (int i = 0; i < tab.size(); i++) {
        super = newInstance->createCopy();
        super->read(tab.at(i).toObject());
        row = super->getModelRow();
        model->appendRow(row);
    }
    model->appendRow(SuperListItem::getEmptyItem());

    delete newInstance;
}

// -------------------------------------------------------

void SuperListItem::writeTree(QStandardItemModel *model, QJsonObject &json,
    const QString &name)
{
    SuperListItem *super;
    QJsonArray tab;
    QJsonObject obj;

    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        obj = QJsonObject();
        super = reinterpret_cast<SuperListItem *>(model->item(i)
            ->data().value<quintptr>());
        if (super != nullptr) {
            super->write(obj);
            tab.append(obj);
        } else {
            model->removeRow(i--);
        }
    }
    model->appendRow(SuperListItem::getEmptyItem());

    if (!tab.isEmpty()) {
        json[name] = tab;
    }
}

// -------------------------------------------------------

void SuperListItem::reset() {
    p_id = -1;
    p_name = "<None>";
}

// -------------------------------------------------------

void SuperListItem::getIcon(QIcon &icon) {
    QPixmap pix(24, 24);

    icon = QIcon(pix);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SuperListItem::read(const QJsonObject &json)
{
    readId(json);
    p_name = json[JSON_NAME].toString();
}

// -------------------------------------------------------

void SuperListItem::readId(const QJsonObject &json){
    p_id = json[JSON_ID].toInt();
}

// -------------------------------------------------------

void SuperListItem::write(QJsonObject &json) const
{
    writeId(json);
    json[JSON_NAME] = name();
}

// -------------------------------------------------------

void SuperListItem::writeId(QJsonObject &json) const{
    json[JSON_ID] = id();
}
