/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMHEROES_H
#define SYSTEMHEROES_H

#include "systemtranslatable.h"
#include "systempicture.h"
#include "systemclass.h"

// -------------------------------------------------------
//
//  CLASS SystemHero
//
//  A particulary hero (datas).
//
// -------------------------------------------------------

class SystemHero : public SystemTranslatable
{
public:
    static const QString jsonClass;
    static const QString jsonBattler;
    static const QString jsonFaceset;
    static const QString jsonClassInherit;

    SystemHero();
    SystemHero(int i, QString name, int idClass, int idBattler, int idFaceset,
        SystemClass *classInherit);
    virtual ~SystemHero();
    int idClass() const;
    void setIdClass(int id);
    int idBattlerPicture() const;
    void setIdBattlerPicture(int id);
    int idFacesetPicture() const;
    void setIdFacesetPicture(int id);
    SystemClass * classInherit() const;
    SystemPicture* getPictureBattler() const;
    SystemPicture* getPictureFaceset() const;
    SystemClass * getClass() const;
    int maxLevel() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idClass;
    int m_idBattlerPicture;
    int m_idFacesetPicture;
    SystemClass * m_classInherit;
};

Q_DECLARE_METATYPE(SystemHero)

#endif // SYSTEMHEROES_H
