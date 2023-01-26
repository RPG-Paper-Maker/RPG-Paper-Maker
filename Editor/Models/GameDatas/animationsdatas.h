/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef ANIMATIONSDATAS_H
#define ANIMATIONSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS AnimationsDatas
//
//  Contains all the possible armors of a game. The data file is located in
//  Content/Datas/animations.json.
//
// -------------------------------------------------------

class AnimationsDatas : public Serializable
{
public:
    static const QString JSON_ANIMATIONS;

    AnimationsDatas();
    virtual ~AnimationsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();
    void setDefaultTranslations();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // ANIMATIONSDATAS_H
