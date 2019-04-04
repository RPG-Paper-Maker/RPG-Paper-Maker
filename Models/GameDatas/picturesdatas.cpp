/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "picturesdatas.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PicturesDatas::PicturesDatas()
{

}

PicturesDatas::~PicturesDatas()
{
    QHash<PictureKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++)
        SuperListItem::deleteModel(i.value());
}

void PicturesDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathPicturesDatas), *this);
}

QStandardItemModel* PicturesDatas::model(PictureKind kind) const {
    return m_models[kind];
}

void PicturesDatas::setModel(PictureKind kind, QStandardItemModel *model) {
    m_models[kind] = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PicturesDatas::setDefault(){
    QList<QString> names;

    setDefaultBars(names);
    setDefaultFacesets(names);
    setDefaultIcons(names);
    setDefaultAutotiles(names);
    setDefaultBattlers(names);
    setDefaultCharacters(names);
    setDefaultReliefs(names);
    setDefaultTilesets(names);
    setDefaultWalls(names);
    setDefaultWindowSkins(names);
    setDefaultTitleScreen(names);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultBars(QList<QString>& names) {
    names << "hpBar" << "mpBar" << "spBar";
    setDefaultPictures(names, PictureKind::Bars);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultFacesets(QList<QString>& names) {
    names << "lucas" << "kate" << "bibi" << "shana" << "wooly";
    setDefaultPictures(names, PictureKind::Facesets);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultIcons(QList<QString>& names) {
    names << "g" << "xcoin" << "attack" << "skill" << "item" << "escape" <<
        "endTurn" << "blazingSword" << "darkness" << "heal" << "fire" << "water"
        << "wind" << "bandage" << "concentration" << "HPPotion" <<
        "superHPPotion" << "megaHPPotion" << "MPPotion" << "superMPPotion" <<
        "megaMPPotion" << "TPPotion" << "superTPPotion" << "megaTPPotion" <<
        "key" << "woodenSword" << "ironAxe" << "bronzeHelmet" << "bronzeMail" <<
        "bronzeVambraces" << "bronzeGreaves" << "saphirRing" << "saphirNecklace";
    setDefaultPictures(names, PictureKind::Icons);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultWindowSkins(QList<QString>& names) {
    names << "default";
    setDefaultPictures(names, PictureKind::WindowSkins);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultTitleScreen(QList<QString>& names) {
    names << "logo" << "background";
    setDefaultPictures(names, PictureKind::TitleScreen);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultAutotiles(QList<QString>& names) {
    names << "general";
    setDefaultPictures(names, PictureKind::Autotiles);
    SystemPicture* picture = (SystemPicture*) m_models[PictureKind::Autotiles]
            ->item(1)->data().value<quintptr>();
    picture->setDefaultAutotiles();
}

// -------------------------------------------------------

void PicturesDatas::setDefaultBattlers(QList<QString>& names) {
    names << "lucas" << "kate" << "bibi" << "shana" << "wooly";
    setDefaultPictures(names, PictureKind::Battlers);
    SystemPicture* picture = (SystemPicture*) m_models[PictureKind::Battlers]
            ->item(1)->data().value<quintptr>();
}

// -------------------------------------------------------

void PicturesDatas::setDefaultCharacters(QList<QString>& names) {
    names << "lucas";
    setDefaultPictures(names, PictureKind::Characters);
    SystemPicture* picture = (SystemPicture*) m_models[PictureKind::Characters]
            ->item(1)->data().value<quintptr>();
    picture->setDefaultLucas();
}

// -------------------------------------------------------

void PicturesDatas::setDefaultReliefs(QList<QString>& names) {
    names << "grass";
    setDefaultPictures(names, PictureKind::Reliefs);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultTilesets(QList<QString>& names) {
    names << "plains";
    setDefaultPictures(names, PictureKind::Tilesets);
    SystemPicture* picture = (SystemPicture*) m_models[PictureKind::Tilesets]
            ->item(1)->data().value<quintptr>();
    picture->setDefaultTilesetPlains();
}

// -------------------------------------------------------

void PicturesDatas::setDefaultWalls(QList<QString>& names) {
    names << "inside1";
    setDefaultPictures(names, PictureKind::Walls);
    SystemPicture* picture = (SystemPicture*) m_models[PictureKind::Walls]
            ->item(1)->data().value<quintptr>();
    picture->setDefaultWallInside();
}

// -------------------------------------------------------

void PicturesDatas::fillList(QList<SystemPicture*> &pictures,
                             QList<QString>& names)
{
    int i;

    pictures << new SystemPicture;
    for (i = 0; i < names.size() ; i++)
        pictures << new SystemPicture(i + 1, names.at(i) + ".png", true);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultPictures(QList<QString> &names,
                                       PictureKind kind)
{
    QList<SystemPicture*> pictures;
    fillList(pictures, names);

    QStandardItemModel* model = new QStandardItemModel;
    QList<QStandardItem*> row;

    for (int i = 0; i < pictures.size(); i++){
        row = pictures.at(i)->getModelRow();
        model->appendRow(row);
    }
    m_models[kind] = model;

    names.clear();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void PicturesDatas::read(const QJsonObject &json){
    QJsonArray jsonList = json["list"].toArray();
    QJsonObject jsonObj;
    QJsonArray jsonArray;
    QStandardItemModel* model;
    QList<QStandardItem*> row;

    // Clear
    QHash<PictureKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++)
        SuperListItem::deleteModel(i.value());

    // Read
    for (int i = 0; i < jsonList.size(); i++){
        jsonObj = jsonList.at(i).toObject();
        jsonArray = jsonObj["v"].toArray();
        model = new QStandardItemModel;

        for (int j = 0; j < jsonArray.size(); j++){
            SystemPicture* super = new SystemPicture;
            super->read(jsonArray[j].toObject());
            row = super->getModelRow();
            model->appendRow(row);
        }

        m_models[static_cast<PictureKind>(jsonObj["k"].toInt())] = model;
    }
}

// -------------------------------------------------------

void PicturesDatas::write(QJsonObject &json) const{
    QJsonArray jsonFinalArray;
    QStandardItemModel* model;

    QHash<PictureKind, QStandardItemModel*>::const_iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++){
        model = i.value();
        QJsonObject jsonObj;
        QJsonArray jsonArray;
        jsonObj["k"] = (int) i.key();
        for (int j = 0; j < model->invisibleRootItem()->rowCount(); j++){
            QJsonObject jsonObjPicture;

            SystemPicture* super = ((SystemPicture*) model->item(j)->data()
                                    .value<quintptr>());
            super->write(jsonObjPicture);
            jsonArray.append(jsonObjPicture);
        }
        jsonObj["v"] = jsonArray;
        jsonFinalArray.append(jsonObj);
    }

    json["list"] = jsonFinalArray;
}
