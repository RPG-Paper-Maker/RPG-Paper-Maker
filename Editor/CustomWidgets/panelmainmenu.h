/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    void loadContents();
    void translate();

private:
    Ui::PanelMainMenu *ui;

signals:
    void openingProject(QString path);

private slots:
    void on_pushButtonExampleProject_clicked();
    void on_pushButtonNewProject_clicked();
    void on_pushButtonOpenProject_clicked();
    void openRecentProject(QString path);
    void on_widgetPatreon_clicked();
};

#endif // PANELMAINMENU_H
