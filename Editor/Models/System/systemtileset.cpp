/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemspecialelement.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTileset::SystemTileset() :
    SystemTileset(1, "", 1)
{

}

SystemTileset::SystemTileset(int i, QString n, int pictureID) :
    SuperListItem(i, n),
    m_pictureID(pictureID)
{
    initializeModels();
}

SystemTileset::~SystemTileset(){
    SuperListItem::deleteModel(m_modelAutotiles);
    SuperListItem::deleteModel(m_modelSpriteWalls);
    SuperListItem::deleteModel(m_model3DObjects);
    SuperListItem::deleteModel(m_modelMountains);
}

SystemPicture* SystemTileset::picture() const {
    SystemPicture *picture;

    picture = reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM
        ::get()->project()->picturesDatas()->model(PictureKind::Tilesets)
        ->invisibleRootItem(), m_pictureID, false));
    if (picture == nullptr) {
        picture = RPM::get()->project()->picturesDatas()->missingPicture();
        picture->setId(m_pictureID);
    }

    return picture;
}

void SystemTileset::setPictureID(int id) {
    m_pictureID = id;
}

QStandardItemModel* SystemTileset::model(PictureKind kind) const {
    switch (kind) {
    case PictureKind::Autotiles:
        return modelAutotiles();
    case PictureKind::Walls:
        return modelSpriteWalls();
    case PictureKind::Mountains:
        return modelMountains();
    case PictureKind::Object3D:
        return model3DObjects();
    default:
        return nullptr;
    }
}

QStandardItemModel* SystemTileset::modelAutotiles() const {
    return m_modelAutotiles;
}

QStandardItemModel* SystemTileset::modelSpriteWalls() const {
    return m_modelSpriteWalls;
}

QStandardItemModel* SystemTileset::model3DObjects() const {
    return m_model3DObjects;
}

QStandardItemModel* SystemTileset::modelMountains() const {
    return m_modelMountains;
}

int SystemTileset::pictureID() const {
    return m_pictureID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemTileset::initializeModels() {
    m_modelAutotiles = new QStandardItemModel;
    m_modelSpriteWalls = new QStandardItemModel;
    m_model3DObjects = new QStandardItemModel;
    m_modelMountains = new QStandardItemModel;
}

// -------------------------------------------------------

void SystemTileset::addSpecial(SuperListItem* special, PictureKind kind)
{
    QStandardItemModel* model = this->model(kind);
    QStandardItem* item;
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(special)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(special->toString());
    model->appendRow(item);
}

// -------------------------------------------------------

void SystemTileset::updateModelAutotiles() {
    updateModel(m_modelAutotiles, RPM::get()->project()
                ->specialElementsDatas()->modelAutotiles());
}

// -------------------------------------------------------

void SystemTileset::updateModelSpriteWalls() {
    updateModel(m_modelSpriteWalls, RPM::get()->project()
                ->specialElementsDatas()->modelSpriteWalls());
}

// -------------------------------------------------------

void SystemTileset::updateModel3DObjects() {
    updateModel(m_model3DObjects, RPM::get()->project()
                ->specialElementsDatas()->modelObjects3D());
}

// -------------------------------------------------------

void SystemTileset::updateModelMountains() {
    updateModel(m_modelMountains, RPM::get()->project()
                ->specialElementsDatas()->modelMountains());
}

// -------------------------------------------------------

void SystemTileset::updateModel(QStandardItemModel* model,
                                QStandardItemModel* completeModel)
{
    SuperListItem* super, *superComplete;
    QStandardItem* item;
    QList<int> indexes;

    // Check if the model contains removed IDs
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        item = model->item(i);
        super = (SuperListItem*) item->data().value<quintptr>();
        superComplete = (SuperListItem*) SuperListItem::getById(
                    completeModel->invisibleRootItem(), super->id(), false);
        if (superComplete == nullptr)
            indexes.append(i);
        else {
            super->setName(superComplete->name());
            item->setText(super->toString());
        }
    }

    // Remove the IDs not existing
    for (int i = 0; i < indexes.size(); i++)
        model->removeRow(indexes.at(i));
}

// -------------------------------------------------------

void SystemTileset::moveModel(QStandardItemModel* model,
                                     QStandardItemModel* completeModel,
                                     int index)
{
    SuperListItem* super, *superComplete;
    superComplete = (SuperListItem*) completeModel->item(index)->data()
            .value<quintptr>();
    super = SuperListItem::getById(model->invisibleRootItem(),
                                   superComplete->id(), false);

    // If the item is not already in the model
    if (super == nullptr) {
        QStandardItem* item;
        SuperListItem* superNew = new SuperListItem;
        superNew->setCopy(*superComplete);
        superNew->setId(superComplete->id());
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(superNew)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(superNew->toString());
        model->appendRow(item);
    }
}

// -------------------------------------------------------

SuperListItem* SystemTileset::createCopy() const{
    SystemTileset* super = new SystemTileset;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTileset::setCopy(const SuperListItem &super) {
    const SystemTileset *tileset;

    SuperListItem::setCopy(super);

    tileset = reinterpret_cast<const SystemTileset *>(&super);
    m_pictureID = tileset->m_pictureID;

    // Models
    SuperListItem::deleteModel(m_modelAutotiles, false);
    SuperListItem::copyModel(m_modelAutotiles, tileset->m_modelAutotiles);
    SuperListItem::deleteModel(m_modelSpriteWalls, false);
    SuperListItem::copyModel(m_modelSpriteWalls, tileset->m_modelSpriteWalls);
    SuperListItem::deleteModel(m_modelMountains, false);
    SuperListItem::copyModel(m_modelMountains, tileset->m_modelMountains);
    SuperListItem::deleteModel(m_model3DObjects, false);
    SuperListItem::copyModel(m_model3DObjects, tileset->m_model3DObjects);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemTileset::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_pictureID = json["pic"].toInt();

    // Special elements
    readModel(json, "auto", m_modelAutotiles);
    readModel(json, "walls", m_modelSpriteWalls);
    readModel(json, "objs", m_model3DObjects);
    readModel(json, "moun", m_modelMountains);
}

// -------------------------------------------------------

void SystemTileset::readModel(const QJsonObject &json, QString key,
                              QStandardItemModel* model)
{
    // Clear
    SuperListItem::deleteModel(model, false);

    // Read
    QJsonArray jsonList = json[key].toArray();
    QStandardItem* item;
    SuperListItem* sys;
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        sys = new SuperListItem;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        model->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemTileset::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["pic"] = m_pictureID;

    // Special elements
    writeModel(json, "auto", m_modelAutotiles);
    writeModel(json, "walls", m_modelSpriteWalls);
    writeModel(json, "objs", m_model3DObjects);
    writeModel(json, "moun", m_modelMountains);
}

// -------------------------------------------------------

void SystemTileset::writeModel(QJsonObject &json, QString key,
                               QStandardItemModel* model)
{
    SuperListItem* sys;
    QJsonArray jsonArray;

    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        QJsonObject json;
        sys = ((SuperListItem*) model->item(i)->data().value<quintptr>());
        sys->write(json);
        jsonArray.append(json);
    }
    json[key] = jsonArray;
}
