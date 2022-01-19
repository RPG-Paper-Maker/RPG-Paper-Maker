/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMFONTNAME_H
#define SYSTEMFONTNAME_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemFontName
//
//  A particulary font name (datas).
//
// -------------------------------------------------------

class SystemFontName : public SuperListItem
{
public:
    static const QString JSON_IS_BASIC;
    static const QString JSON_FONT;
    static const QString JSON_CUSTOM_FONT_ID;
    static const bool DEFAULT_IS_BASIC;
    static const QString DEFAULT_FONT;
    static const int DEFAULT_CUSTOM_FONT_ID;

    SystemFontName();
    SystemFontName(int i, QString n, bool isBasic = DEFAULT_IS_BASIC,
        PrimitiveValue *font = new PrimitiveValue(DEFAULT_FONT), int customFontID
        = DEFAULT_CUSTOM_FONT_ID);
    virtual ~SystemFontName();

    bool isBasic() const;
    void setIsBasic(bool isBasic);
    PrimitiveValue * font() const;
    int customFontID() const;
    void setCustomFontID(int customFontID);

    QString getCSS(QStandardItemModel *modelFonts = nullptr) const;

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBasic;
    PrimitiveValue * m_font;
    int m_customFontID;
};

Q_DECLARE_METATYPE(SystemFontName)

#endif // SYSTEMFONTNAME_H
