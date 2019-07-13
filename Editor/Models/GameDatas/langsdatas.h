/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef LANGSDATAS_H
#define LANGSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS LangDatas
//
//  The data file is located in
//  Content/Datas/langs.json.
//
// -------------------------------------------------------

class LangsDatas : public Serializable
{
public:
    LangsDatas();
    virtual ~LangsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();
    int mainLang() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // LANGSDATAS_H
