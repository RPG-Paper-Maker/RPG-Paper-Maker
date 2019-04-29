/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELMAINMENU_H
#define PANELMAINMENU_H

#include <QWidget>

// -------------------------------------------------------
//
//  CLASS PanelMainMenu
//
//  The main menu panel when no projects are selected.
//
// -------------------------------------------------------

namespace Ui {
class PanelMainMenu;
}

class PanelMainMenu : public QWidget
{
    Q_OBJECT

public:
    explicit PanelMainMenu(QWidget *parent = nullptr);
    ~PanelMainMenu();

private:
    Ui::PanelMainMenu *ui;

signals:
    void openingProject(QString path);

private slots:
    void on_pushButtonNewProject_clicked();
    void on_pushButtonOpenProject_clicked();
    void openRecentProject(QString path);
};

#endif // PANELMAINMENU_H
