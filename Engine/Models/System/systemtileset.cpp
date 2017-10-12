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

#include "systemspecialelement.h"
#include "wanok.h"

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
    SuperListItem::deleteModel(m_modelReliefs);
}

SystemPicture* SystemTileset::picture() const {
    return (SystemPicture*) SuperListItem::getById(
                Wanok::get()->project()->picturesDatas()
                ->model(PictureKind::Tilesets)->invisibleRootItem(),
                m_pictureID);
}

void SystemTileset::setPictureID(int id) {
    m_pictureID = id;
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

QStandardItemModel* SystemTileset::modelReliefs() const {
    return m_modelReliefs;
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
    m_modelReliefs = new QStandardItemModel;
}

// -------------------------------------------------------

void SystemTileset::addSpecial(SystemSpecialElement* special,
                               QStandardItemModel* model)
{
    QStandardItem* item;
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(special)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(special->toString());
    model->appendRow(item);
}

// -------------------------------------------------------

void SystemTileset::addSpriteWall(SystemSpriteWall* wall) {
    addSpecial(wall, modelSpriteWalls());
}

// -------------------------------------------------------

void SystemTileset::updateModelAutotiles() {
    updateModel(m_modelAutotiles, Wanok::get()->project()
                ->specialElementsDatas()->modelAutotiles());
}

// -------------------------------------------------------

void SystemTileset::updateModelSpriteWalls() {
    updateModel(m_modelSpriteWalls, Wanok::get()->project()
                ->specialElementsDatas()->modelSpriteWalls());
}

// -------------------------------------------------------

void SystemTileset::updateModel3DObjects() {
    updateModel(m_model3DObjects, Wanok::get()->project()
                ->specialElementsDatas()->model3DObjects());
}

// -------------------------------------------------------

void SystemTileset::updateModelReliefs() {
    updateModel(m_modelReliefs, Wanok::get()->project()
                ->specialElementsDatas()->modelReliefs());
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

void SystemTileset::setCopy(const SystemTileset& super){
    SuperListItem::setCopy(super);

    m_pictureID = super.m_pictureID;
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
    readModel(json, "3D", m_model3DObjects);
    readModel(json, "relief", m_modelReliefs);
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
    writeModel(json, "3D", m_model3DObjects);
    writeModel(json, "relief", m_modelReliefs);
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
