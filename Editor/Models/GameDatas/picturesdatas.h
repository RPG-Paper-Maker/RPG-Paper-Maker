/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QStandardItemModel>
#include "serializable.h"
#include "systempicture.h"
#include "picturekind.h"

// -------------------------------------------------------
//
//  CLASS PicturesDatas
//
//  Contains all the possible pictures of a game. The data file is located in
//  Content/Datas/pictures.json.
//
// -------------------------------------------------------

#ifndef PICTURESDATAS_H
#define PICTURESDATAS_H

class PicturesDatas : public Serializable
{
public:
    PicturesDatas();
    virtual ~PicturesDatas();
    void read(QString path);
    QStandardItemModel* model(PictureKind kind) const;
    void setModel(PictureKind kind, QStandardItemModel* model);
    SystemPicture * missingPicture() const;

    void setDefault();
    void fillList(QList<SystemPicture*> &pictures, QList<QString> &names);
    void setDefaultPictures(QList<QString>& names, PictureKind kind);
    void setDefaultBars(QList<QString>& names);
    void setDefaultFacesets(QList<QString>& names);
    void setDefaultIcons(QList<QString>& names);
    void setDefaultWindowSkins(QList<QString>& names);
    void setDefaultTitleScreen(QList<QString>& names);
    void setDefaultHUDPictures(QList<QString>& names);
    void setDefaultAutotiles(QList<QString>& names);
    void setDefaultBattlers(QList<QString>& names);
    void setDefaultCharacters(QList<QString>& names);
    void setDefaultReliefs(QList<QString>& names);
    void setDefaultTilesets(QList<QString>& names);
    void setDefaultWalls(QList<QString>& names);
    void setDefaultObjects3D(QList<QString>& names);
    void setDefaultAnimations(QList<QString>& names);
    void setDefaultSkyBoxes(QList<QString>& names);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QHash<PictureKind, QStandardItemModel*> m_models;
    SystemPicture *m_missingPicture;
};

#endif // PICTURESDATAS_H
