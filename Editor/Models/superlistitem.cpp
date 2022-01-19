/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
#include "systemcommonskillitem.h"
#include "systemweaponarmorkind.h"

const QString SuperListItem::JSON_ID = "id";
const QString SuperListItem::JSON_NAME = "name";
const int SuperListItem::DEFAULT_ID = 1;
const QString SuperListItem::DEFAULT_NAME = "";
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

SuperListItem::SuperListItem(int i, QString n, bool datas, bool displayID, bool isNew) :
    p_id(i),
    p_name(n),
    m_containsDatas(datas),
    m_displayID(displayID),
    m_isNew(isNew)
{

}

int SuperListItem::id() const { return p_id; }

void SuperListItem::setId(int i) { p_id = i; }

QString SuperListItem::name() const { return p_name; }

void SuperListItem::setName(QString n){ p_name = n; }

void SuperListItem::setDisplayID(bool b) {
    m_displayID = b;
}

bool SuperListItem::isNew() const
{
    return m_isNew;
}

void SuperListItem::setIsNew(bool isNew)
{
    m_isNew = isNew;
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
    m_isNew = item.m_isNew;
}

// -------------------------------------------------------

QString SuperListItem::toString() const {
    if (m_displayID)
    {
        return id() > 0 ? (QString(beginningText) + idToString() + QString(": ")
            + name()) : name();
    }
    return this->toStringName();
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

bool SuperListItem::containsName(QStandardItemModel *model, QString name)
{
    SuperListItem *super;
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++)
    {
        super = reinterpret_cast<SuperListItem *>(model->item(i)->data().value<
            quintptr>());
        if (super != nullptr && super->name() == name)
        {
            return true;
        }
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SuperListItem::getItemModelAt(QStandardItemModel *model, int i)
{
    QStandardItem *item = model->item(i);
    return item == nullptr ? nullptr : reinterpret_cast<SuperListItem *>(item
        ->data().value<quintptr>());
}

// -------------------------------------------------------

void SuperListItem::deleteModel(QStandardItemModel *model, bool deleteModel)
{
    SuperListItem::deleteModelItem(model->invisibleRootItem());
    if (deleteModel)
    {
        delete model;
    } else
    {
        model->clear();
    }
}

// -------------------------------------------------------

void SuperListItem::deleteModelItem(QStandardItem *item)
{
    SuperListItem *super;
    QStandardItem *child;
    for (int i = 0, l = item->rowCount(); i < l; i++)
    {
        child = item->child(i);
        super = reinterpret_cast<SuperListItem *>(child->data().value<quintptr>());
        if (super != nullptr)
        {
            delete super;
        }
        SuperListItem::deleteModelItem(child);
    }
}

// -------------------------------------------------------

void SuperListItem::deleteModelTree(QStandardItem *item) {
    SuperListItem *super;
    int i, l;

    for (i = 0, l = item->rowCount(); i < l; i++) {
        deleteModelTree(item->child(i));
        super = reinterpret_cast<SuperListItem *>(item->child(i)->data().value<
            quintptr>());
        if (super != nullptr) {
            delete super;
        }
    }
}

// -------------------------------------------------------

int SuperListItem::getIndexById(QStandardItem* item, int id, bool first) {
    if (item == nullptr)
    {
        return -1;
    }
    int l;

    l = item->rowCount();
    if (l > 0) {
        SuperListItem *s;
        int i, j;

        for (i = 0, j = 0; i < l; i++) {
            s = reinterpret_cast<SuperListItem *>(item->child(i)->data().value<
                quintptr>());
            if (s != nullptr) {
                if (id == s->id()) {
                    return j;
                }
                j++;
            }
        }
    }

    return first ? 0 : -1;
}

// -------------------------------------------------------

int SuperListItem::getIdByIndex(QStandardItemModel* model, int index){
    SuperListItem *super = SuperListItem::getByIndex(model, index);
    return super == nullptr ? -1 : super->id();
}

// -------------------------------------------------------

SuperListItem* SuperListItem::getById(QStandardItem* item, int id, bool first)
{
    if (item == nullptr)
    {
        return nullptr;
    }
    int l = item->rowCount();
    if (l > 0) {
        SuperListItem *s;
        int i;

        for (i = 0; i < l; i++) {
            s = reinterpret_cast<SuperListItem *>(item->child(i)->data().value<
                quintptr>());
            if (s != nullptr && id == s->id()) {
                return s;
            }
        }
        if (first) {
            return reinterpret_cast<SuperListItem *>(item->child(0)->data()
                .value<quintptr>());
        }
    }

    return nullptr;
}

// -------------------------------------------------------

QStandardItem * SuperListItem::getItemByID(QStandardItem *item, int id, bool
    first)
{
    if (item == nullptr)
    {
        return nullptr;
    }
    int l;

    l = item->rowCount();
    if (l > 0) {
        SuperListItem *s;
        QStandardItem *row;
        int i;

        for (i = 0; i < l; i++) {
            row = item->child(i);
            s = reinterpret_cast<SuperListItem *>(row->data().value<quintptr>());
            if (s != nullptr && id == s->id()) {
                return row;
            }
        }
        if (first) {
            return item->child(0);
        }
    }

    return nullptr;
}

// -------------------------------------------------------

SuperListItem * SuperListItem::getByIndex(QStandardItemModel* model, int index) {
    if (model == nullptr)
    {
        return nullptr;
    }
    int i, l;

    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        SuperListItem *s;

        s = reinterpret_cast<SuperListItem *>(model->item(i)->data().value<
            qintptr>());
        if (s == nullptr) {
            index++;
        } else {
            if (i == index) {
                return s;
            }
        }
    }

    return nullptr;
}

// -------------------------------------------------------

void SuperListItem::fillComboBox(QComboBox* comboBox, QStandardItemModel* model,
    bool showID, bool nameOnly, bool showIcon)
{
    if (model == nullptr)
    {
        return;
    }
    int l = model->invisibleRootItem()->rowCount();
    if (l > 0) {
        SuperListItem *sys;
        QStandardItem *item;
        QIcon icon;
        int i;

        for (i = 0; i < l; i++) {
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

void SuperListItem::copyModel(QStandardItemModel* model, QStandardItemModel*
    baseModel)
{
    SuperListItem* super, *superBase;
    QList<QStandardItem*> row;

    for (int i = 0; i < baseModel->invisibleRootItem()->rowCount(); i++) {
        superBase = reinterpret_cast<SuperListItem *>(baseModel->item(i)->data()
                .value<quintptr>());
        super = superBase->createCopy();
        super->setId(superBase->id());
        row = super->getModelRow();
        model->appendRow(row);
    }
}

// -------------------------------------------------------

void SuperListItem::replaceModel(QStandardItemModel* model, QStandardItemModel*
    baseModel)
{
    SuperListItem* super, *superBase;
    int i, l;

    for (i = 0, l = baseModel->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SuperListItem *>(model->item(i)->data()
            .value<quintptr>());
        superBase = reinterpret_cast<SuperListItem *>(baseModel->item(i)->data()
            .value<quintptr>());
        super->setCopy(*superBase);
        model->removeRow(i);
        model->insertRow(i, super->getModelRow());
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

void SuperListItem::removeEmptyInTree(QStandardItemModel *model)
{
    QStandardItem *item;
    SuperListItem *super;
    for (int i = model->invisibleRootItem()->rowCount() - 1; i >= 0; i--)
    {
        item = model->item(i);
        if (item == nullptr)
        {
            model->removeRow(i);
        } else
        {
            super = reinterpret_cast<SuperListItem *>(item->data().value<
                quintptr>());
            if (super == nullptr)
            {
                model->removeRow(i);
            }
        }
    }
}

// -------------------------------------------------------

QList<QStandardItem *> SuperListItem::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    if (!m_containsDatas || RPM::get()->project()->gameDatas()->isDatasRead()) {
        item->setText(this->toString());
    }
    row.append(item);
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
    for (int i = 0; i < modelToCopy->invisibleRootItem()->rowCount(); i++){
        SuperListItem* super = reinterpret_cast<SuperListItem *>(modelToCopy
            ->item(i)->data().value<quintptr>());
        if (super != nullptr) {
            SuperListItem* newSuper = super->createCopy();
            row = newSuper->getModelRow();
            model->appendRow(row);
        }
    }
    model->appendRow(SuperListItem::getEmptyItem());
}

// -------------------------------------------------------

void SuperListItem::readTree(QStandardItemModel *model, SuperListItem
    *newInstance, const QJsonObject &json, const QString &name)
{
    SuperListItem::readList(model, newInstance, json, name);
    model->appendRow(SuperListItem::getEmptyItem());
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

void SuperListItem::readList(QStandardItemModel *model, SuperListItem
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

    delete newInstance;
}

// -------------------------------------------------------

void SuperListItem::writeList(QStandardItemModel *model, QJsonObject &json,
    const QString &name)
{
    SuperListItem *super;
    QJsonArray tab;
    QJsonObject obj;

    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        obj = QJsonObject();
        super = reinterpret_cast<SuperListItem *>(model->item(i)->data().value<
            quintptr>());
        super->write(obj);
        tab.append(obj);
    }

    json[name] = tab;
}

// -------------------------------------------------------

void SuperListItem::getWeaponsList(QStandardItemModel *model, int id)
{
    updateWeaponsArmorsList(model, RPM::get()->project()->gameDatas()
        ->weaponsDatas()->model(), RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelWeaponsKind(), id);
}

// -------------------------------------------------------

void SuperListItem::getArmorsList(QStandardItemModel *model, int id)
{
    updateWeaponsArmorsList(model, RPM::get()->project()->gameDatas()
        ->armorsDatas()->model(), RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelArmorsKind(), id);
}

// -------------------------------------------------------

void SuperListItem::updateWeaponsArmorsList(QStandardItemModel *model,
    QStandardItemModel *modelWeaponArmor, QStandardItemModel
    *modelWeaponArmorKind, int id)
{
    SystemCommonSkillItem *weaponArmor;
    SystemWeaponArmorKind *kind;
    for (int i = 0, l = modelWeaponArmor->invisibleRootItem()->rowCount(); i < l
         ; i++)
    {
        weaponArmor = reinterpret_cast<SystemCommonSkillItem *>(modelWeaponArmor
            ->item(i)->data().value<quintptr>());
        kind = reinterpret_cast<SystemWeaponArmorKind *>(SuperListItem::getById(
            modelWeaponArmorKind->invisibleRootItem(), weaponArmor->type()));
        if (kind->getEquipmenAt(id))
        {
            model->appendRow(weaponArmor->getModelRow());
        }
    }
}

// -------------------------------------------------------

void SuperListItem::updateModelToString(QStandardItemModel *model)
{
    SuperListItem *super;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        super = SuperListItem::getItemModelAt(model, i);
        if (super != nullptr)
        {
            model->item(i)->setText(super->toString());
        }
    }
}

// -------------------------------------------------------

void SuperListItem::reset() {
    p_id = -1;
    p_name = "<" + RPM::translate(Translations::NONE) + ">";
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
