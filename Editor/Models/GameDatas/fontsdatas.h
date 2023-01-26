/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef FONTSDATAS_H
#define FONTSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemfont.h"

// -------------------------------------------------------
//
//  CLASS FontsDatas
//
//  Contains all the possible videos of a game. The data file is located in
//  Content/Datas/fonts.json.
//
// -------------------------------------------------------

class FontsDatas : public Serializable
{
public:
    const static QString JSON_LIST;

    FontsDatas();
    virtual ~FontsDatas();

    QStandardItemModel * model() const;
    void setModel(QStandardItemModel *model);

    void read(QString path);
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // FONTSDATAS_H
