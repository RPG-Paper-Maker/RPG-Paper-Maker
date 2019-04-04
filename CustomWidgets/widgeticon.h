/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETICON_H
#define WIDGETICON_H

#include <QWidget>
#include "systemicon.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetIcon
//
//  A widget used for updating an icon with a preview.
//
// -------------------------------------------------------

namespace Ui {
class WidgetIcon;
}

class WidgetIcon : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetIcon(QWidget *parent = nullptr);
    ~WidgetIcon();

    void initializeIcon(SystemIcon *icon);

private:
    Ui::WidgetIcon *ui;

protected:
    SystemIcon *m_icon;

public slots:
    void on_pictureChanged(SystemPicture *picture);
};

#endif // WIDGETICON_H
