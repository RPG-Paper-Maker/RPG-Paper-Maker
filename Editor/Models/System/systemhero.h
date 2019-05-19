/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMHEROES_H
#define SYSTEMHEROES_H

#include "systemlang.h"
#include "systempicture.h"
#include "systemclass.h"

// -------------------------------------------------------
//
//  CLASS SystemHero
//
//  A particulary hero (datas).
//
// -------------------------------------------------------

class SystemHero : public SystemLang
{
public:
    static const QString jsonClass;
    static const QString jsonBattler;
    static const QString jsonFaceset;
    static const QString jsonClassInherit;

    SystemHero();
    SystemHero(int i, LangsTranslation* names, int idClass, int idBattler, int
        idFaceset, SystemClass *classInherit);
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
    void setCopy(const SystemHero& hero);
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
