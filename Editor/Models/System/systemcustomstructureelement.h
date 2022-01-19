/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCUSTOMSTRUCTUREELEMENT_H
#define SYSTEMCUSTOMSTRUCTUREELEMENT_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemCustomStructureElement
//
//  A particulary custom structure element (for plugins).
//
// -------------------------------------------------------

class SystemCustomStructureElement : public SuperListItem
{
public:
    static const QString JSON_IS_PROPERTY;
    static const QString JSON_DESCRIPTION;
    static const QString JSON_VALUE;
    static const bool DEFAULT_IS_PROPERTY;
    static const QString DEFAULT_DESCRIPTION;
    static const QString COLOR_CUSTOM;
    static const QString COLOR_KEY;

    SystemCustomStructureElement();
    SystemCustomStructureElement(int i, QString n, bool ip = DEFAULT_IS_PROPERTY
        , PrimitiveValue *v = PrimitiveValue::createDefaultNumberDoubleValue());
    virtual ~SystemCustomStructureElement();
    bool isProperty() const;
    QString description() const;
    PrimitiveValue * value() const;
    void setIsProperty(bool isProperty);
    void setDescription(QString description);
    void setValue(PrimitiveValue *value);

    bool isCustom() const;
    QString getStringEnd() const;

    virtual QString toString() const;
    virtual QString toStringName() const;
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isProperty;
    QString m_description;
    PrimitiveValue *m_value;
};

Q_DECLARE_METATYPE(SystemCustomStructureElement)

#endif // SYSTEMCUSTOMSTRUCTUREELEMENT_H
